import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateProductDto,
  DeleteProductDto,
  GetManyProductsDto,
  UpdateProductDto,
} from './dto';
import { ProductsService } from './products.service';
import { Throttle } from '@nestjs/throttler';

@Controller('products')
export class ProductsController {
  constructor(private readonly _productService: ProductsService) {}

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Post()
  create(@Body() body: CreateProductDto.Body): CreateProductDto.Response {
    return this._productService.create(body);
  }

  @Throttle({ read: { limit: 100, ttl: 60000 } })
  @Get()
  getMany(
    @Query() query: GetManyProductsDto.Query,
  ): GetManyProductsDto.Response {
    return this._productService.getMany(query);
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Patch(':id')
  async updateOne(
    @Param() { id }: UpdateProductDto.Params,
    @Body() body: UpdateProductDto.Body,
  ): UpdateProductDto.Response {
    const data = await this._productService.updateOne(id, body);

    return { data };
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() { id }: DeleteProductDto.Params) {
    await this._productService.deleteOne({ id });
  }
}
