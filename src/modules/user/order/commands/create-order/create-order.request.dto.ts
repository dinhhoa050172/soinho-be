import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty({
    description: '',
    example: 1,
  })
  @IsNotEmpty()
  addressId: bigint;

  @ApiProperty({
    description: '',
    example: '',
  })
  @IsNotEmpty()
  totalAmount: Prisma.Decimal;

  @ApiProperty({
    description: '',
    example: 1,
  })
  @IsNotEmpty()
  paymentMethodId: bigint;
}
