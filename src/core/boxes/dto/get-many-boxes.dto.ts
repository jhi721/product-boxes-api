import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { BoxDto } from './models';
import { IsKeyOfClass, transformQueryJson } from '../../../utils/validation';

export namespace GetManyBoxesDto {
  class Search implements Partial<BoxDto> {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    label?: string;
  }

  export class Query {
    @IsOptional()
    @ValidateNested()
    @Type(() => Search)
    @Transform(transformQueryJson<Search>)
    search: Search = {};

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @Max(100)
    @IsPositive()
    limit: number = 10;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @IsPositive()
    offset: number = 0;

    @Expose({ name: 'sort_by' })
    @IsString()
    @IsKeyOfClass(BoxDto)
    @IsOptional()
    sortBy?: keyof BoxDto;

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
    data: BoxDto[];
    pagination: Pagination;
  }>;
}
