import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { PaymentMethodResponseDto } from './payment-method.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodPaginatedResponseDto extends PaginatedResponseDto<PaymentMethodResponseDto> {
  @ApiProperty({ type: PaymentMethodResponseDto, isArray: true })
  readonly data: readonly PaymentMethodResponseDto[];

  constructor(props: {
    data: PaymentMethodResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
