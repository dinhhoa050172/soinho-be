import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { OrderResponseDto } from './order.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class OrderPaginatedResponseDto extends PaginatedResponseDto<OrderResponseDto> {
  @ApiProperty({ type: OrderResponseDto, isArray: true })
  readonly data: readonly OrderResponseDto[];

  constructor(props: {
    data: OrderResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
