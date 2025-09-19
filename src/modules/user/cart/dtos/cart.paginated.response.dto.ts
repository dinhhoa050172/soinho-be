import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { ApiProperty } from '@nestjs/swagger';
import { CartResponseDto } from './cart.response.dto';

export class CartPaginatedResponseDto extends PaginatedResponseDto<CartResponseDto> {
  @ApiProperty({ type: CartResponseDto, isArray: true })
  readonly data: readonly CartResponseDto[];

  constructor(props: {
    data: CartResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
