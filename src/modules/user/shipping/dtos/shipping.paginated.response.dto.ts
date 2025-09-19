import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { ShippingResponseDto } from './shipping.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ShippingPaginatedResponseDto extends PaginatedResponseDto<ShippingResponseDto> {
  @ApiProperty({ type: ShippingResponseDto, isArray: true })
  readonly data: readonly ShippingResponseDto[];

  constructor(props: {
    data: ShippingResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
