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
  AddProductDto,
  CreateBoxDto,
  DeleteBoxDto,
  GetManyBoxesDto,
  GetOneBoxDto,
  RemoveProductsDto,
  UpdateBoxDto,
} from './dto';
import { BoxesService } from './boxes.service';
import { Throttle } from '@nestjs/throttler';

@Controller('boxes')
export class BoxesController {
  constructor(private readonly _boxesService: BoxesService) {}

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Post()
  create(@Body() body: CreateBoxDto.Body): CreateBoxDto.Response {
    return this._boxesService.create(body);
  }

  @Throttle({ read: { limit: 100, ttl: 60000 } })
  @Get(':id')
  getOne(@Param() params: GetOneBoxDto.Params): GetOneBoxDto.Response {
    return this._boxesService.getOne(params);
  }

  @Throttle({ read: { limit: 100, ttl: 60000 } })
  @Get()
  getMany(@Query() query: GetManyBoxesDto.Query): GetManyBoxesDto.Response {
    return this._boxesService.getMany(query);
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Patch(':id')
  async updateOne(
    @Param() { id }: UpdateBoxDto.Params,
    @Body() body: UpdateBoxDto.Body,
  ): UpdateBoxDto.Response {
    const data = await this._boxesService.updateOne(id, body);

    return { data };
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Post(':id/products')
  addProductsToBox(
    @Param() params: AddProductDto.Params,
    @Body() body: AddProductDto.Body,
  ): AddProductDto.Response {
    return this._boxesService.addProductsToBox({ ...params, ...body });
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @Delete(':id/products')
  removeProductsFromBox(
    @Param() params: RemoveProductsDto.Params,
    @Body() body: RemoveProductsDto.Body,
  ): RemoveProductsDto.Response {
    return this._boxesService.removeProductsFromBox({ ...params, ...body });
  }

  @Throttle({ write: { limit: 30, ttl: 60000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() { id }: DeleteBoxDto.Params) {
    await this._boxesService.deleteOne({ id });
  }
}
