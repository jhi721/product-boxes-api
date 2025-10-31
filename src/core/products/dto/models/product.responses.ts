import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { PaginationDto } from '@common/dto';

export class ProductItemResponseDto {
  @ApiProperty({ type: () => ProductDto })
  data: ProductDto;
}

export class ProductListResponseDto {
  @ApiProperty({ type: () => [ProductDto] })
  data: ProductDto[];

  @ApiProperty({ type: () => PaginationDto })
  pagination: PaginationDto;
}
