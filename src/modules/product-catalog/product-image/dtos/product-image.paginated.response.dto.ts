import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImageResponseDto } from './product-image.response.dto';

export class ProductImagePaginatedResponseDto extends PaginatedResponseDto<ProductImageResponseDto> {
  @ApiProperty({ type: ProductImageResponseDto, isArray: true })
  readonly data: readonly ProductImageResponseDto[];

  constructor(props: {
    data: ProductImageResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
