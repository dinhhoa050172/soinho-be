import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { OrderItemResponseDto } from './order-item.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemPaginatedResponseDto extends PaginatedResponseDto<OrderItemResponseDto> {
  @ApiProperty({ type: OrderItemResponseDto, isArray: true })
  readonly data: readonly OrderItemResponseDto[];

  constructor(props: {
    data: OrderItemResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
