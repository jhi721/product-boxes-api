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
import { CreateProductDto, GetManyProductsDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly _productService: ProductsService) {}

  @Post()
  create(@Body() body: CreateProductDto.Body): CreateProductDto.Response {
    return this._productService.create(body);
  }

  @Get()
  getMany(
    @Query() query: GetManyProductsDto.Query,
  ): GetManyProductsDto.Response {
    console.log(query);
    return this._productService.getMany(query);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() body: UpdateProductDto.Body,
  ): UpdateProductDto.Response {
    const data = await this._productService.updateOne(id, body);

    return { data };
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this._productService.deleteOne({ id });
  }
}
