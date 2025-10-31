import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import {
  CreateProductBodyDto,
  GetManyProductsQueryDto,
  UpdateProductBodyDto,
} from './dto';

@Injectable()
export class ProductsService {
  constructor(private readonly _productRepository: ProductsRepository) {}

  public async create(data: CreateProductBodyDto) {
    const product = await this._productRepository.create(data);

    return { data: product };
  }

  public async getMany({
    search,
    limit,
    sortBy,
    offset,
    direction,
  }: GetManyProductsQueryDto) {
    const order: Record<string, typeof direction> = {};

    if (sortBy) {
      order[sortBy] = direction;
    }

    const { data, total } = await this._productRepository.getMany(
      search || {},
      {
        limit,
        offset,
        order,
      },
    );

    return {
      data,
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }

  public async updateOne(id: string, data: UpdateProductBodyDto) {
    const product = await this._productRepository.updateOne({
      id,
      data,
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  public async deleteOne(params: { id: string }) {
    await this._productRepository.deleteOne(params);
  }
}
