import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BoxDto } from './models';
import { BoxStatus } from '../entities';

export namespace UpdateBoxDto {
  export class Params {
    @IsUUID()
    id: string;
  }

  export class Body {
    @IsString()
    @MaxLength(32)
    @MinLength(3)
    @IsOptional()
    label?: string;

    @IsEnum(BoxStatus)
    @IsOptional()
    status?: BoxStatus;
  }

  export type Response = Promise<{ data: BoxDto }>;
}
