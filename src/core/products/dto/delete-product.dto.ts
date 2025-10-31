import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductParamsDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}
