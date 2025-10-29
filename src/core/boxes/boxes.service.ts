import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxesRepository } from './boxes.repository';
import {
  AddProductDto,
  CreateBoxDto,
  DeleteBoxDto,
  GetManyBoxesDto,
  GetOneBoxDto,
  RemoveProductsDto,
  UpdateBoxDto,
} from './dto';

@Injectable()
export class BoxesService {
  constructor(private readonly _boxesRepository: BoxesRepository) {}

  public async create(data: CreateBoxDto.Body) {
    const product = await this._boxesRepository.create(data);

    return { data: product };
  }

  public async getOne(params: GetOneBoxDto.Params) {
    const data = await this._boxesRepository.getOne(params);

    return { data };
  }

  public async getMany({
    search,
    limit,
    sortBy,
    offset,
    direction,
  }: GetManyBoxesDto.Query) {
    const order: Record<string, typeof direction> = {};

    if (sortBy) {
      order[sortBy] = direction;
    }

    const { data, total } = await this._boxesRepository.getMany(search || {}, {
      limit,
      offset,
      order,
    });

    return {
      data,
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }

  public async updateOne(id: string, data: UpdateBoxDto.Body) {
    const product = await this._boxesRepository.updateOne({
      id,
      data,
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  public async addProductsToBox(
    params: AddProductDto.Params & AddProductDto.Body,
  ) {
    const data = await this._boxesRepository.addProducts(params);

    return {
      data,
    };
  }

  public async removeProductsFromBox(
    params: RemoveProductsDto.Params & RemoveProductsDto.Query,
  ) {
    const data = await this._boxesRepository.removeProducts(params);

    return { data };
  }

  public async deleteOne(params: DeleteBoxDto.Params) {
    await this._boxesRepository.deleteOne(params);
  }
}
