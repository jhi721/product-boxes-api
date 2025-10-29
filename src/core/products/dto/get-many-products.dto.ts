import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { ProductDto } from './models';
import { IsKeyOfClass } from '../../../utils/validation';

export namespace GetManyProductsDto {
  class Search implements Partial<ProductDto> {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    barcode?: string;
  }

  export class Query {
    @IsOptional()
    @ValidateNested()
    @Type(() => Search)
    @Transform(({ value }) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value) as Search;
        } catch {
          return undefined;
        }
      }
    })
    search: Search = {};

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @Max(100)
    limit: number = 10;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    offset: number = 0;

    @Expose({ name: 'sort_by' })
    @IsString()
    @IsKeyOfClass(ProductDto)
    @IsOptional()
    sortBy?: keyof ProductDto;

    @IsString()
    @IsOptional()
    @IsIn(['asc', 'desc'])
    @ValidateIf((obj: Query) => !!obj.sortBy)
    direction: 'asc' | 'desc' = 'desc';
  }

  type Pagination = {
    limit: number;
    offset: number;
    total: number;
  };

  export type Response = Promise<{
    data: ProductDto[];
    pagination: Pagination;
  }>;
}
