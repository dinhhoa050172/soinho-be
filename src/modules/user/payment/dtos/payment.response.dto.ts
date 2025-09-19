import { ApiProperty } from '@nestjs/swagger';
import { StatusPayment } from '@prisma/client';
import { ResponseBase } from 'src/libs/api/response.base';

export class PaymentResponseDto extends ResponseBase<any> {
  @ApiProperty({
    description: '',
    example: 1,
  })
  amount: number;

  @ApiProperty({
    description: '',
    example: '',
  })
  description?: string | null;

  @ApiProperty({
    description: '',
    example: '',
  })
  payUrl?: string | null;

  @ApiProperty({
    description: '',
    example: StatusPayment.PENDING,
  })
  status: StatusPayment;

  @ApiProperty({
    description: '',
    example: 1,
  })
  paymentMethodId: string;

  @ApiProperty({
    description: '',
    example: 1,
  })
  orderId: string;
}
