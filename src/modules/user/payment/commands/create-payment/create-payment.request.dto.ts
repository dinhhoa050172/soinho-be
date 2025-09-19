import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePaymentRequestDto {
  @ApiProperty({
    description: 'id phương thức thanh toán',
    example: 1,
  })
  @IsNotEmpty()
  paymentMethodId: bigint;

  @ApiProperty({
    description: 'tên phương thức thanh toán',
    example: 'cash',
  })
  @IsNotEmpty()
  paymentMethodName: string;
}
