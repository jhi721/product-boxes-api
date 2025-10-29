import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProductDto } from './models';

export namespace UpdateProductDto {
  export class Params {
    @IsUUID()
    id: string;
  }

  export class Body {
    @IsString()
    @MaxLength(100)
    @MinLength(2)
    @IsOptional()
    name?: string;

    @IsString()
    @MaxLength(32)
    @MinLength(8)
    @IsOptional()
    barcode?: string;
  }

  export type Response = Promise<{ data: ProductDto }>;
}
