import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteBoxParamsDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}
