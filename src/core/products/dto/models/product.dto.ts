import { Product } from '@core/products/entities';
import { IsDate, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto implements Omit<Product, 'box'> {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  barcode: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  createdAt: Date;
}
