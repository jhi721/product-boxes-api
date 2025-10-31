import { IsUUID } from 'class-validator';
import { BoxDto } from './models';
import { ApiProperty } from '@nestjs/swagger';

export class GetOneBoxParamsDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}

export type GetOneBoxResponse = Promise<{
  data: BoxDto | null;
}>;
