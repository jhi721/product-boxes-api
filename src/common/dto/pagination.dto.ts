import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  limit: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  offset: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  total: number;
}
