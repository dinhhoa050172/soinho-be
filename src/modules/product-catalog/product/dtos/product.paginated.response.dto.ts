import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product.response.dto';

export class ProductPaginatedResponseDto extends PaginatedResponseDto<ProductResponseDto> {
  @ApiProperty({ type: ProductResponseDto, isArray: true })
  readonly data: readonly ProductResponseDto[];

  constructor(props: {
    data: ProductResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
