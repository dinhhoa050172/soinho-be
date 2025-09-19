import { ApiProperty } from '@nestjs/swagger';
import { StatusPayment } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdatePaymentRequestDto {
  @ApiProperty({
    example: StatusPayment.SUCCESSED,
    description: 'The new status of the payment',
  })
  @IsNotEmpty()
  @IsEnum(StatusPayment)
  status: StatusPayment;
}
