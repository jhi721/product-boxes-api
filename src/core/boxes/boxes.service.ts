import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { Box, BoxStatus } from './entities';
import { ProductsRepository } from '../products/products.repository';
import { In } from 'typeorm';

@Injectable()
export class BoxesService {
  constructor(
    private readonly _boxesRepository: BoxesRepository,
    private readonly _productsRepository: ProductsRepository,
  ) {}

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
    const box = await this._boxesRepository.getOne({ id });

    if (!box) {
      throw new NotFoundException();
    }

    if (data.status) {
      this._validateBoxStatusTransition(box, data.status);
    }

    const product = await this._boxesRepository.updateOne({
      id,
      data,
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  private _validateBoxStatusTransition(box: Box, status: BoxStatus) {
    const allowedStatuses: Record<BoxStatus, BoxStatus | null> = {
      [BoxStatus.Created]: BoxStatus.Sealed,
      [BoxStatus.Sealed]: BoxStatus.Shipped,
      [BoxStatus.Shipped]: null,
    };

    if (status) {
      if (allowedStatuses[box.status] !== status) {
        throw new BadRequestException();
      }
    }
  }

  public async addProductsToBox({
    id,
    productIds,
  }: AddProductDto.Params & AddProductDto.Body) {
    const box = await this._boxesRepository.getOne({ id });
    if (!box) {
      throw new NotFoundException();
    }

    if (box.status !== BoxStatus.Created) {
      throw new BadRequestException();
    }

    const products = await this._productsRepository.getMany({
      id: In(productIds),
    });

    if (products.total < productIds.length) {
      throw new NotFoundException('Some of the products do not exist');
    }

    const data = await this._boxesRepository.addProducts({
      id,
      products: products.data,
    });

    return {
      data,
    };
  }

  public async removeProductsFromBox({
    id,
    productIds,
  }: RemoveProductsDto.Params & RemoveProductsDto.Query) {
    const box = await this._boxesRepository.getOne({ id });
    if (!box) {
      throw new NotFoundException();
    }

    if (box.status !== BoxStatus.Created) {
      throw new BadRequestException();
    }

    const products = await this._productsRepository.getMany({
      id: In(productIds),
      box: {
        id,
      },
    });

    if (products.total < productIds.length) {
      throw new NotFoundException('Some of the products do not exist');
    }

    await this._boxesRepository.removeProducts({
      id,
      products: products.data,
    });

    const data = await this._boxesRepository.getOne({ id });

    return { data };
  }

  public async deleteOne(params: DeleteBoxDto.Params) {
    const box = await this._boxesRepository.getOne(params);

    if (!box) {
      throw new NotFoundException();
    }

    if (box.status !== BoxStatus.Created) {
      throw new BadRequestException();
    }

    await this._boxesRepository.deleteOne(params);
  }
}
