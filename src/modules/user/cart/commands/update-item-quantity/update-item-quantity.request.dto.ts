import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsBigInt } from 'src/libs/decorators/class-validator.decorator';

export class UpdateItemQuantityRequestDto {
  @ApiProperty({
    example: 1,
    description: 'Cart Id',
  })
  @IsNotEmpty()
  @IsBigInt()
  cartId: bigint;

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
}
