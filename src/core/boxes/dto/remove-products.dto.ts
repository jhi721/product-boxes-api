import { IsArray, IsUUID } from 'class-validator';
import { BoxDto } from './models';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveProductsParamsDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}

export class RemoveProductsBodyDto {
  @ApiProperty({ type: 'string', isArray: true, example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @IsUUID('all', { each: true })
  productIds: string[];
}

export type RemoveProductsResponse = Promise<{
  data: BoxDto | null;
}>;
