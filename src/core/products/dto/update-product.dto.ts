import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProductDto } from './models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductParamsDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}

export class UpdateProductBodyDto {
  @ApiPropertyOptional({ minLength: 2, maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ minLength: 8, maxLength: 32 })
  @IsString()
  @MaxLength(32)
  @MinLength(8)
  @IsOptional()
  barcode?: string;
}

export type UpdateProductResponse = Promise<{ data: ProductDto }>;
