import {
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { BoxDto } from './models';
import { CreateProductDto } from '../../products/dto';
import { Type } from 'class-transformer';

export namespace CreateBoxDto {
  export class Body implements Pick<BoxDto, 'label'> {
    @IsString()
    @Matches('/^[A-Z0-9-_]{3,32}$/')
    @MaxLength(32)
    @MinLength(3)
    label: string;

    @ValidateNested({ each: true })
    @Type(() => CreateProductDto.Body)
    products: CreateProductDto.Body[];
  }

  export type Response = Promise<{ data: BoxDto }>;
}
