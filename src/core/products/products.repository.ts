import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities';
import { DeepPartial, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { IProductRepository } from './types';
import { FindOptionsOrderValue } from 'typeorm/find-options/FindOptionsOrder';
import { Box, BoxStatus } from '../boxes/entities';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly _productsRepository: Repository<Product>,
  ) {}

  public async create(
    data: IProductRepository.Create.Params,
  ): IProductRepository.Create.ReturnType {
    const product = this._productsRepository.create(data);

    return this._productsRepository.save(product);
  }

  public async getMany(
    filter: FindOptionsWhere<Product>,
    options: {
      limit?: number;
      offset?: number;
      order?: Partial<Record<keyof Product, FindOptionsOrderValue>>;
    } = {},
  ) {
    const [data, total] = await this._productsRepository.findAndCount({
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

  public async updateOne({
    id,
    data,
  }: {
    id: string;
    data: DeepPartial<Product>;
  }) {
    return this._productsRepository.manager.transaction(
      async (entityManager) => {
        const product = await entityManager.findOne(Product, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          return null;
        }

        if (product.box) {
          await entityManager.findOne(Box, {
            where: { id: product.box.id },
            lock: { mode: 'pessimistic_write' },
          });
        }

        if (product.box && product.box.status !== BoxStatus.Created) {
          return null;
        }

        Object.assign(product, data);

        return entityManager.save(product);
      },
    );
  }

  async deleteOne({ id }: { id: string }) {
    await this._productsRepository.manager.transaction(
      async (entityManager) => {
        const product = await entityManager.findOne(Product, {
          where: { id },
          relations: ['box'],
        });

        if (!product) {
          return;
        }

        if (product.box) {
          const box = await entityManager.findOne(Box, {
            where: { id: product.box.id },
            lock: { mode: 'pessimistic_write' },
          });

          console.log(product.box);

          if (!box || box.status !== BoxStatus.Created) {
            return;
          }
        }

        await entityManager.delete(Product, id);
      },
    );
  }
}
