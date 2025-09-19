import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCustomResponseDto } from './product-custom.response.dto';

export class ProductCustomPaginatedResponseDto extends PaginatedResponseDto<ProductCustomResponseDto> {
  @ApiProperty({ type: ProductCustomResponseDto, isArray: true })
  readonly data: readonly ProductCustomResponseDto[];

  constructor(props: {
    data: ProductCustomResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
