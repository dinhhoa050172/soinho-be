import { ApiProperty } from '@nestjs/swagger';
import { StatusTransaction } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  totalPrice: string;

  @ApiProperty({
    enum: StatusTransaction,
    description: 'The status of the transaction',
  })
  @IsNotEmpty()
  status: StatusTransaction;
}
