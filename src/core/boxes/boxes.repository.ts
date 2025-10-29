import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Box, BoxStatus } from './entities';
import { DeepPartial, FindOptionsWhere, In, Repository } from 'typeorm';
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
  ) {}

  public async create(
    data: IBoxesRepository.Create.Params,
  ): IBoxesRepository.Create.ReturnType {
    const product = this._boxesRepository.create(data);

    return this._boxesRepository.save(product);
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
    const box = await this.getOne({ id });
    if (!box) {
      return null;
    }

    const products = await this._productsRepository.findBy({
      id: In(productIds),
    });
    if (productIds.length !== products.length) {
      return null;
    }

    const productsToUpdate = products.map((product) => {
      product.box = box;

      return product;
    });

    await this._productsRepository.save(productsToUpdate);

    return products;
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
    const box = await this.getOne({ id });
    if (!box) {
      return null;
    }

    if (box.status !== BoxStatus.Created) {
      return null;
    }

    const products = await this._productsRepository.findBy({
      id: In(productIds),
    });
    if (productIds.length !== products.length) {
      return null;
    }

    const productsToUpdate = products.map((product) => {
      product.box = null;

      return product;
    });

    await this._productsRepository.save(productsToUpdate);

    return products;
  }
}
