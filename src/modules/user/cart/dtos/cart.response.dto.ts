import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ResponseBase } from 'src/libs/api/response.base';

class CartItemDto {
  @ApiProperty({ example: '1' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: '150000.00' })
  price: Prisma.Decimal | string;

  @ApiProperty({ example: 'bo-hoa-len-hong-phai' })
  slug?: string;

  @ApiProperty({ example: 'Bó hoa len hồng phai' })
  productName?: string;

  @ApiProperty({ example: '' })
  productImageUrl?: string | null;
}

export class CartResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '',
    description: '',
  })
  userId: string;

  @ApiProperty({ type: [CartItemDto] })
  items: CartItemDto[];
}
