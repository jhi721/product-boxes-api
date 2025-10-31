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
import { BoxDto } from './models';
import { IsKeyOfClass, transformQueryJson } from '@utils/validation';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetManyBoxesSearchDto implements Partial<BoxDto> {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  label?: string;
}

export class GetManyBoxesQueryDto {
  @ApiPropertyOptional({ description: 'JSON stringified search object' })
  @IsOptional()
  @ValidateNested()
  @Type(() => GetManyBoxesSearchDto)
  @Transform(transformQueryJson<GetManyBoxesSearchDto>)
  search: GetManyBoxesSearchDto = {} as GetManyBoxesSearchDto;

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
    enum: Object.keys(new BoxDto()),
  })
  @IsString()
  @IsKeyOfClass(BoxDto)
  @IsOptional()
  sortBy?: keyof BoxDto;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ValidateIf((obj: GetManyBoxesQueryDto) => !!obj.sortBy)
  direction: 'asc' | 'desc' = 'desc';
}

type Pagination = {
  limit: number;
  offset: number;
  total: number;
};

export type GetManyBoxesResponse = Promise<{
  data: BoxDto[];
  pagination: Pagination;
}>;
