import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/core/app/app.module';
import { DataSource, Repository } from 'typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Box, BoxStatus } from '../src/core/boxes/entities';
import { Product } from '../src/core/products/entities';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

if (!process.env.DB_URL) {
  throw new Error('Please provide a DB_URL env var');
}

describe('Boxes API', () => {
  let app: NestExpressApplication;
  let dataSource: DataSource;
  let boxRepository: Repository<Box>;
  let productRepository: Repository<Product>;

  let createdBoxId: string;
  let createdProductIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    dataSource = app.get(DataSource);
    // Ensure a clean schema so labels/products from previous runs don't collide
    await dataSource.synchronize(true);
    boxRepository = dataSource.getRepository(Box);
    productRepository = dataSource.getRepository(Product);
  });

  afterAll(async () => {
    await productRepository.createQueryBuilder().delete().execute();
    await boxRepository.createQueryBuilder().delete().execute();
    await dataSource.destroy();

    await app.close();
  });

  const runId = Date.now();
  const baseLabel = `BOX-ABC_123_${runId}`;
  const newLabel = `BOX-ABC_124_${runId}`;

  it('POST /boxes should create a box with products', async () => {
    const body = {
      label: baseLabel,
      products: [
        { name: 'Box Prod 1', barcode: 'barcode1' },
        { name: 'Box Prod 2', barcode: 'barcode2' },
      ],
    };

    const res = await request(app.getHttpServer())
      .post('/boxes')
      .send(body)
      .expect(201);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toMatchObject({
      label: body.label,
      status: BoxStatus.Created,
    });
    expect(Array.isArray(res.body.data.products)).toBe(true);
    expect(res.body.data.products.length).toBe(2);

    createdBoxId = res.body.data.id as string;
    createdProductIds = res.body.data.products.map(
      (product: Product) => product.id,
    );

    const boxFromDB = await boxRepository.findOne({
      where: { id: createdBoxId },
      relations: ['products'],
    });
    expect(boxFromDB).toBeTruthy();
    expect(boxFromDB?.products.length).toBe(2);
  });

  it('POST /boxes should return 400 for invalid label', async () => {
    const body = {
      label: 'ab',
      products: [{ name: 'p', barcode: 'barcode1234' }],
    };
    await request(app.getHttpServer()).post('/boxes').send(body).expect(400);
  });

  it('GET /boxes should return paginated boxes', async () => {
    const res = await request(app.getHttpServer()).get('/boxes').expect(200);
    const count = await boxRepository.count();

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination.total).toBe(count);
  });

  it('GET /boxes should return box queried by label', async () => {
    const res = await request(app.getHttpServer())
      .get('/boxes')
      .query({ search: JSON.stringify({ label: baseLabel }) })
      .expect(200);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].id).toBe(createdBoxId);
  });

  it('GET /boxes/:id should return box with products', async () => {
    const res = await request(app.getHttpServer())
      .get(`/boxes/${createdBoxId}`)
      .expect(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.id).toBe(createdBoxId);
    expect(Array.isArray(res.body.data.products)).toBe(true);
    expect(res.body.data.products.length).toBe(2);
  });

  it('PATCH /boxes/:id should update label', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/boxes/${createdBoxId}`)
      .send({ label: newLabel })
      .expect(200);
    expect(res.body.data.label).toBe(newLabel);
  });

  it('PATCH /boxes/:id should perform valid status transition to SEALED', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/boxes/${createdBoxId}`)
      .send({ status: BoxStatus.Sealed })
      .expect(200);
    expect(res.body.data.status).toBe(BoxStatus.Sealed);
  });

  it('POST /boxes/:id/products should fail when box is not CREATED', async () => {
    // Create a product to try to add
    const prod = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Unassigned', barcode: 'UNASSIGNED00001' })
      .expect(201);

    const productId = prod.body.data.id as string;

    await request(app.getHttpServer())
      .post(`/boxes/${createdBoxId}/products`)
      .send({ productIds: [productId] })
      .expect(400);
  });

  it('DELETE /boxes/:id/products should fail when box is not CREATED', async () => {
    await request(app.getHttpServer())
      .delete(`/boxes/${createdBoxId}/products`)
      .query({ productIds: [createdProductIds[0]] })
      .expect(400);
  });

  it('PATCH /boxes/:id should perform valid status transition to SHIPPED', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/boxes/${createdBoxId}`)
      .send({ status: BoxStatus.Shipped })
      .expect(200);
    expect(res.body.data.status).toBe(BoxStatus.Shipped);
  });

  it('DELETE /boxes/:id should fail when status is not CREATED', async () => {
    await request(app.getHttpServer())
      .delete(`/boxes/${createdBoxId}`)
      .expect(400);
  });

  it('DELETE /boxes/:id should delete a CREATED box', async () => {
    const resCreate = await request(app.getHttpServer())
      .post('/boxes')
      .send({
        label: 'BOX_BOX',
        products: [{ name: 'temp prod', barcode: 'barcode_temp' }],
      })
      .expect(201);

    const boxId = resCreate.body.data.id as string;

    await request(app.getHttpServer()).delete(`/boxes/${boxId}`).expect(204);

    const exists = await boxRepository.findOne({ where: { id: boxId } });
    expect(exists).toBeNull();
  });
});
