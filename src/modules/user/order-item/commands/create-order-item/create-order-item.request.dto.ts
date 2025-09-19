import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderItemRequestDto {
  @ApiProperty({
    description: 'The price of the product in the order item',
    example: '20000',
  })
  @IsNotEmpty()
  price: Prisma.Decimal;

  @ApiProperty({
    description: 'The unit price of the product in the order item',
    example: '20000',
  })
  @IsNotEmpty()
  unitPrice: Prisma.Decimal;

  @ApiProperty({
    description: 'The quantity of the product in the order item',
    example: 1,
  })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'The ID of the order to which this item belongs',
    example: 1,
  })
  @IsNotEmpty()
  orderId: bigint;

  @ApiProperty({
    description: 'The ID of the product in the order item',
    example: 1,
  })
  @IsNotEmpty()
  productId: bigint;
}
