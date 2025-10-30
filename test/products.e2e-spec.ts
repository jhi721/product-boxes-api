import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/core/app/app.module';
import { DataSource, Repository } from 'typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Product } from '../src/core/products/entities';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

if (!process.env.DB_URL) {
  throw new Error('Please provide a DB_URL env var');
}

describe('Products API', () => {
  let app: NestExpressApplication;
  let dataSource: DataSource;
  let productRepository: Repository<Product>;
  let createdProductId: string;

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
    productRepository = dataSource.getRepository(Product);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await productRepository.deleteAll();
      await dataSource.destroy();
    }

    await app.close();
  });

  it('POST /products should create a product', async () => {
    const body = { name: 'Product 1', barcode: 'barcodeprod1' };
    const res = await request(app.getHttpServer())
      .post('/products')
      .send(body)
      .expect(201);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toMatchObject({
      name: body.name,
      barcode: body.barcode,
    });

    const productFromDB = await productRepository.findOneByOrFail({
      id: res.body.data.id,
    });

    expect(body.name).toBe(productFromDB.name);
    expect(body.barcode).toBe(productFromDB.barcode);

    createdProductId = res.body.data.id as string;
  });

  it('POST /products should return 400 if input data is not valid', async () => {
    const body = { name: 'Product 1', barcode: '2' };
    await request(app.getHttpServer()).post('/products').send(body).expect(400);
  });

  it('GET /products should return paginated products', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);

    const productsCount = await productRepository.count();

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination.total).toBe(productsCount);
  });

  it('GET /products should return product queried by id', async () => {
    const query = JSON.stringify({ id: createdProductId });

    const res = await request(app.getHttpServer())
      .get('/products')
      .query(query)
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.data[0].id).toBe(createdProductId);
  });

  it('PATCH /products/:id should update product name', async () => {
    const newName = 'New Product Name';

    const res = await request(app.getHttpServer())
      .patch(`/products/${createdProductId}`)
      .send({ name: newName })
      .expect(200);

    const productFromDB = await productRepository.findOneByOrFail({
      id: createdProductId,
    });

    expect(res.body.data.name).toBe(newName);
    expect(productFromDB.name).toBe(newName);
  });

  it('DELETE /products/:id should delete product', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${createdProductId}`)
      .expect(204);

    const productFromDB = await productRepository.findOneBy({
      id: createdProductId,
    });
    expect(productFromDB).toBeNull();
  });
});
