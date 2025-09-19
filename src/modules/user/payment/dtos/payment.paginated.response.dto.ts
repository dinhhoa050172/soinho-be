import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { PaymentResponseDto } from './payment.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentPaginatedResponseDto extends PaginatedResponseDto<PaymentResponseDto> {
  @ApiProperty({ type: PaymentResponseDto, isArray: true })
  readonly data: readonly PaymentResponseDto[];

  constructor(props: {
    data: PaymentResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
