import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './models';

export class CreateProductBodyDto {
  @ApiProperty({ minLength: 2, maxLength: 100, example: 'Product Name' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ minLength: 8, maxLength: 32, example: 'BARCODE123456' })
  @IsString()
  @Length(8, 32)
  barcode: string;
}

export type CreateProductResponse = Promise<{ data: ProductDto }>;
