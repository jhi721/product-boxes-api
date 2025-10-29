import { IsString, MaxLength, MinLength } from 'class-validator';
import { ProductDto } from './models';

export namespace CreateProductDto {
  export class Body {
    @IsString()
    @MaxLength(100)
    @MinLength(2)
    name: string;

    @IsString()
    @MaxLength(32)
    @MinLength(8)
    barcode: string;
  }

  export type Response = Promise<{ data: ProductDto }>;
}
