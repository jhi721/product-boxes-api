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
  AddProductsBodyDto,
  AddProductsParamsDto,
  CreateBoxBodyDto,
  DeleteBoxParamsDto,
  GetManyBoxesQueryDto,
  GetOneBoxParamsDto,
  RemoveProductsBodyDto,
  RemoveProductsParamsDto,
  UpdateBoxBodyDto,
  UpdateBoxParamsDto,
  BoxItemResponseDto,
  BoxListResponseDto,
  type AddProductsResponse,
  type RemoveProductsResponse,
  type UpdateBoxResponse,
  type GetManyBoxesResponse,
  type GetOneBoxResponse,
  type CreateBoxResponse,
} from './dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BoxesService } from './boxes.service';
import { Throttle } from '@nestjs/throttler';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@ApiTags('boxes')
@Controller('boxes')
export class BoxesController {
  constructor(private readonly _boxesService: BoxesService) {}

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Post()
  @ApiCreatedResponse({ type: BoxItemResponseDto })
  create(@Body() body: CreateBoxBodyDto): CreateBoxResponse {
    return this._boxesService.create(body);
  }

  @Throttle({ read: { limit: 100, ttl: 60000 } })
  @Get(':id')
  @ApiOkResponse({ type: BoxItemResponseDto })
  getOne(@Param() params: GetOneBoxParamsDto): GetOneBoxResponse {
    return this._boxesService.getOne(params);
  }

  @Throttle({ read: { limit: 100, ttl: 60000 } })
  @Get()
  @ApiOkResponse({ type: BoxListResponseDto })
  getMany(@Query() query: GetManyBoxesQueryDto): GetManyBoxesResponse {
    return this._boxesService.getMany(query);
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Patch(':id')
  @ApiOkResponse({ type: BoxItemResponseDto })
  async updateOne(
    @Param() { id }: UpdateBoxParamsDto,
    @Body() body: UpdateBoxBodyDto,
  ): UpdateBoxResponse {
    const data = await this._boxesService.updateOne(id, body);

    return { data };
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Post(':id/products')
  @ApiOkResponse({ type: BoxItemResponseDto })
  addProductsToBox(
    @Param() params: AddProductsParamsDto,
    @Body() body: AddProductsBodyDto,
  ): AddProductsResponse {
    return this._boxesService.addProductsToBox({ ...params, ...body });
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Delete(':id/products')
  @ApiOkResponse({ type: BoxItemResponseDto })
  removeProductsFromBox(
    @Param() params: RemoveProductsParamsDto,
    @Body() body: RemoveProductsBodyDto,
  ): RemoveProductsResponse {
    return this._boxesService.removeProductsFromBox({ ...params, ...body });
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiNoContentResponse()
  async delete(@Param() { id }: DeleteBoxParamsDto) {
    await this._boxesService.deleteOne({ id });
  }
}
