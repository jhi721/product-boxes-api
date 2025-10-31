import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { BoxDto } from './models';
import { BoxStatus } from '@core/boxes/entities';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBoxParamsDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}

export class UpdateBoxBodyDto {
  @ApiPropertyOptional({
    minLength: 3,
    maxLength: 32,
    pattern: '^[A-Z0-9-_]{3,32}$',
  })
  @IsString()
  @Length(3, 32)
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({ enum: BoxStatus })
  @IsEnum(BoxStatus)
  @IsOptional()
  status?: BoxStatus;
}

export type UpdateBoxResponse = Promise<{ data: BoxDto }>;
