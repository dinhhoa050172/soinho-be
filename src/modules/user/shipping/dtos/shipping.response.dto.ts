import { ApiProperty } from '@nestjs/swagger';
import { StatusShipping } from '@prisma/client';
import { ResponseBase } from 'src/libs/api/response.base';

export class ShippingResponseDto extends ResponseBase<any> {
  @ApiProperty({})
  trackingCode?: string;

  @ApiProperty({})
  shippedAt?: Date;

  @ApiProperty({})
  deliveredAt?: Date;

  @ApiProperty({})
  status: StatusShipping;

  @ApiProperty({})
  shippingMethodId: bigint;
}
