import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities';
import { DeepPartial, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { IProductRepository } from './types';
import { FindOptionsOrderValue } from 'typeorm/find-options/FindOptionsOrder';
import { BoxStatus } from '../boxes/entities';

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
    const product = await this._productsRepository.findOne({
      where: [
        { id, box: { status: BoxStatus.Created } },
        { id, box: IsNull() },
      ],
    });

    if (!product) {
      return null;
    }

    Object.assign(product, data);

    return this._productsRepository.save(product);
  }

  public async deleteOne({ id }: { id: string }) {
    await this._productsRepository.delete(id);
  }
}
