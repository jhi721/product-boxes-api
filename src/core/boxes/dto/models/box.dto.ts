import { Box, BoxStatus } from '../../entities';
import {
  IsDate,
  IsEnum,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Product } from '../../../products/entities';
import { Type } from 'class-transformer';
import { ProductDto } from '../../../products/dto';

export class BoxDto implements Box {
  @IsUUID()
  id: string;

  @IsString()
  label: string;

  @IsEnum(BoxStatus)
  status: BoxStatus;

  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: Product[];

  @IsDate()
  updatedAt: Date;

  @IsDate()
  createdAt: Date;
}
