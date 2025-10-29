import { IsString } from 'class-validator';
import { ProductDto } from './models';

export namespace UpdateProductDto {
  export class Body {
    @IsString()
    name: string;

    @IsString()
    barcode: string;
  }

  export type Response = Promise<{ data: ProductDto }>;
}
