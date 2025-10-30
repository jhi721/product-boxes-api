import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { BoxDto } from './models';
import { BoxStatus } from '../entities';

export namespace UpdateBoxDto {
  export class Params {
    @IsUUID()
    id: string;
  }

  export class Body {
    @IsString()
    @Length(3, 32)
    @IsOptional()
    label?: string;

    @IsEnum(BoxStatus)
    @IsOptional()
    status?: BoxStatus;
  }

  export type Response = Promise<{ data: BoxDto }>;
}
