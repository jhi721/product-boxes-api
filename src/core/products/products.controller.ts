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
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateProductBodyDto,
  DeleteProductParamsDto,
  GetManyProductsQueryDto,
  UpdateProductBodyDto,
  UpdateProductParamsDto,
  ProductItemResponseDto,
  ProductListResponseDto,
  type UpdateProductResponse,
  type GetManyProductsResponse,
  type CreateProductResponse,
} from './dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Throttle } from '@nestjs/throttler';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly _productService: ProductsService) {}

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Post()
  @ApiCreatedResponse({ type: ProductItemResponseDto })
  create(@Body() body: CreateProductBodyDto): CreateProductResponse {
    return this._productService.create(body);
  }

  @Throttle({ read: { limit: 100, ttl: 60000 } })
  @Get()
  @ApiOkResponse({ type: ProductListResponseDto })
  getMany(@Query() query: GetManyProductsQueryDto): GetManyProductsResponse {
    return this._productService.getMany(query);
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Patch(':id')
  @ApiOkResponse({ type: ProductItemResponseDto })
  async updateOne(
    @Param() { id }: UpdateProductParamsDto,
    @Body() body: UpdateProductBodyDto,
  ): UpdateProductResponse {
    const data = await this._productService.updateOne(id, body);

    return { data };
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiNoContentResponse()
  async delete(@Param() { id }: DeleteProductParamsDto) {
    await this._productService.deleteOne({ id });
  }
}
