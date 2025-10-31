import { Box, BoxStatus } from '@core/boxes/entities';
import {
  IsDate,
  IsEnum,
  IsString,
  IsUUID,
  ValidateNested,
  Matches,
  Length,
} from 'class-validator';
import { Product } from '@core/products/entities';
import { Type } from 'class-transformer';
import { ProductDto } from '@core/products/dto';
import { ApiProperty } from '@nestjs/swagger';

export class BoxDto implements Box {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ pattern: '^[A-Z0-9-_]{3,32}$', minLength: 3, maxLength: 32 })
  @IsString()
  @Matches(/^[A-Z0-9-_]{3,32}$/)
  @Length(3, 32)
  label: string;

  @ApiProperty({ enum: BoxStatus })
  @IsEnum(BoxStatus)
  status: BoxStatus;

  @ApiProperty({ type: () => [ProductDto] })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: Product[];

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  createdAt: Date;
}
