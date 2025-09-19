import { ApiResponseProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ResponseBase } from 'src/libs/api/response.base';

export class OrderItemResponseDto extends ResponseBase<any> {
  @ApiResponseProperty({})
  price: Prisma.Decimal;

  @ApiResponseProperty({})
  unitPrice: Prisma.Decimal;

  @ApiResponseProperty({})
  quantity: number;

  @ApiResponseProperty({})
  orderId: string;

  @ApiResponseProperty({})
  productId: string;
}
