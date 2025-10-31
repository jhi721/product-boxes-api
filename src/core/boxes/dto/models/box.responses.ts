import { ApiProperty } from '@nestjs/swagger';
import { BoxDto } from './box.dto';
import { PaginationDto } from '@common/dto';

export class BoxItemResponseDto {
  @ApiProperty({ type: () => BoxDto })
  data: BoxDto | null;
}

export class BoxListResponseDto {
  @ApiProperty({ type: () => [BoxDto] })
  data: BoxDto[];

  @ApiProperty({ type: () => PaginationDto })
  pagination: PaginationDto;
}
