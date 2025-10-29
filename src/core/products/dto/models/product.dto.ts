import { Product } from '../../entities';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class ProductDto implements Omit<Product, 'box'> {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  barcode: string;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  createdAt: Date;
}
