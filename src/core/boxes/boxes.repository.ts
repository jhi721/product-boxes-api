import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Box, BoxStatus } from './entities';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  In,
  IsNull,
  Repository,
} from 'typeorm';
import { FindOptionsOrderValue } from 'typeorm/find-options/FindOptionsOrder';
import { IBoxesRepository } from './types';
import { Product } from '../products/entities';

@Injectable()
export class BoxesRepository {
  constructor(
    @InjectRepository(Box)
    private readonly _boxesRepository: Repository<Box>,
    @InjectRepository(Product)
    private readonly _productsRepository: Repository<Product>,
    private readonly _dataSource: DataSource,
  ) {}

  public async create(
    data: IBoxesRepository.Create.Params,
  ): IBoxesRepository.Create.ReturnType {
    return this._dataSource.transaction(async (entityManager) => {
      const box = entityManager.create(Box, {
        label: data.label,
      });

      await entityManager.save(box);

      const products = data.products.map((product) =>
        entityManager.create(Product, {
          name: product.name,
          barcode: product.barcode,
          box,
        }),
      );

      await entityManager.save(products);

      return { ...box, products };
    });
  }

  public async getMany(
    filter: FindOptionsWhere<Box>,
    options: {
      limit: number;
      offset: number;
      order: Partial<Record<keyof Box, FindOptionsOrderValue>>;
    },
  ) {
    const [data, total] = await this._boxesRepository.findAndCount({
      where: filter,
      skip: options.offset,
      take: options.limit,
      order: options.order,
    });

    return {
      data,
      total,
    };
  }

  public async getOne({ id }: { id: string }) {
    return this._boxesRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  public async updateOne({ id, data }: { id: string; data: DeepPartial<Box> }) {
    const product = await this._boxesRepository.findOneBy({
      id,
    });

    if (!product) {
      return null;
    }

    Object.assign(product, data);

    return this._boxesRepository.save(product);
  }

  public async addProducts({
    id,
    productIds,
  }: {
    id: string;
    productIds: string[];
  }) {
    return this._dataSource.transaction(async (entityManager) => {
      const box = await entityManager.findOne(Box, {
        where: {
          id,
          status: BoxStatus.Created,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!box) {
        return null;
      }

      const products = await entityManager.find(Product, {
        where: {
          id: In(productIds),
          box: IsNull(),
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (productIds.length !== products.length) {
        throw new Error('Some products do not exist');
      }

      await this._assignProductsToBox({ entityManager, box, products });

      return entityManager.findOne(Box, {
        where: { id },
        relations: ['products'],
      });
    });
  }

  public async deleteOne({ id }: { id: string }) {
    await this._boxesRepository.delete(id);
  }

  public async removeProducts({
    id,
    productIds,
  }: {
    id: string;
    productIds: string[];
  }) {
    return this._dataSource.transaction(async (entityManager) => {
      const box = await entityManager.findOne(Box, {
        where: {
          id,
          status: BoxStatus.Created,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!box) {
        return null;
      }

      const products = await entityManager.find(Product, {
        where: {
          id: In(productIds),
          box: { id },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      await this._assignProductsToBox({ entityManager, box: null, products });

      return entityManager.findOne(Box, {
        where: { id },
        relations: ['products'],
      });
    });
  }

  private async _assignProductsToBox({
    entityManager,
    box,
    products,
  }: {
    entityManager: EntityManager;
    box: Box | null;
    products: Product[];
  }) {
    const updatedProducts = products.map((product) => {
      product.box = box;

      return product;
    });

    await entityManager.save(updatedProducts);
  }
}
