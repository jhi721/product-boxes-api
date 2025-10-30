import { IsString, Length } from 'class-validator';
import { ProductDto } from './models';

export namespace CreateProductDto {
  export class Body {
    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @Length(8, 32)
    barcode: string;
  }

  export type Response = Promise<{ data: ProductDto }>;
}
