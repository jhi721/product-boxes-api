import {
  IsArray,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { BoxDto } from './models';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProductBodyDto } from '@core/products/dto';

export class CreateBoxBodyDto implements Pick<BoxDto, 'label'> {
  @ApiProperty({
    pattern: '^[A-Z0-9-_]{3,32}$',
    minLength: 3,
    maxLength: 32,
    example: 'BOX-ABC_123',
  })
  @IsString()
  @Matches(/^[A-Z0-9-_]{3,32}$/)
  @Length(3, 32)
  label: string;

  @ApiProperty({ type: () => [CreateProductBodyDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductBodyDto)
  products: CreateProductBodyDto[];
}

export type CreateBoxResponse = Promise<{ data: BoxDto }>;
