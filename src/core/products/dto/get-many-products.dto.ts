import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { ProductDto } from './models';
import { IsKeyOfClass, transformQueryJson } from '@utils/validation';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetManyProductsSearchDto implements Partial<ProductDto> {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  barcode?: string;
}

export class GetManyProductsQueryDto {
  @ApiPropertyOptional({ description: 'JSON stringified search object' })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetManyProductsSearchDto)
  @Transform(transformQueryJson)
  search: GetManyProductsSearchDto = {} as GetManyProductsSearchDto;

  @ApiPropertyOptional({ default: 10, maximum: 100, minimum: 1 })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Max(100)
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({ default: 0, minimum: 0 })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  offset: number = 0;

  @Expose({ name: 'sort_by' })
  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: Object.keys(new ProductDto()),
  })
  @IsString()
  @IsKeyOfClass(ProductDto)
  @IsOptional()
  sortBy?: keyof ProductDto;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ValidateIf((obj: GetManyProductsQueryDto) => !!obj.sortBy)
  direction: 'asc' | 'desc' = 'desc';
}

type Pagination = {
  limit: number;
  offset: number;
  total: number;
};

export type GetManyProductsResponse = Promise<{
  data: ProductDto[];
  pagination: Pagination;
}>;
