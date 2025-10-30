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

@Controller('boxes')
export class BoxesController {
  constructor(private readonly _boxesService: BoxesService) {}

  @Post()
  create(@Body() body: CreateBoxDto.Body): CreateBoxDto.Response {
    return this._boxesService.create(body);
  }

  @Get(':id')
  getOne(@Param() params: GetOneBoxDto.Params): GetOneBoxDto.Response {
    return this._boxesService.getOne(params);
  }

  @Get()
  getMany(@Query() query: GetManyBoxesDto.Query): GetManyBoxesDto.Response {
    return this._boxesService.getMany(query);
  }

  @Patch(':id')
  async updateOne(
    @Param() { id }: UpdateBoxDto.Params,
    @Body() body: UpdateBoxDto.Body,
  ): UpdateBoxDto.Response {
    const data = await this._boxesService.updateOne(id, body);

    return { data };
  }

  @Post(':id/products')
  addProductsToBox(
    @Param() params: AddProductDto.Params,
    @Body() body: AddProductDto.Body,
  ): AddProductDto.Response {
    return this._boxesService.addProductsToBox({ ...params, ...body });
  }

  @Delete(':id/products')
  removeProductsFromBox(
    @Param() params: RemoveProductsDto.Params,
    @Body() body: RemoveProductsDto.Body,
  ): RemoveProductsDto.Response {
    return this._boxesService.removeProductsFromBox({ ...params, ...body });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() { id }: DeleteBoxDto.Params) {
    await this._boxesService.deleteOne({ id });
  }
}
