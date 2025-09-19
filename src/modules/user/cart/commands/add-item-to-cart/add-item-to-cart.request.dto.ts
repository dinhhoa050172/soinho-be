import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { IsBigInt } from 'src/libs/decorators/class-validator.decorator';

export class AddItemToCartRequestDto {
  @ApiProperty({
    example: 1,
    description: 'User Id',
  })
  @IsNotEmpty()
  @IsBigInt()
  userId: bigint;

  @ApiProperty({
    example: 1,
    description: 'Product Id',
  })
  @IsNotEmpty()
  @IsBigInt()
  productId: bigint;

  @ApiProperty({
    example: 1,
    description: 'Quantity',
  })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    example: 1,
    description: 'Price',
  })
  @IsNotEmpty()
  price: Prisma.Decimal;
}
