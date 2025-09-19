import { ApiProperty } from '@nestjs/swagger';

export class CreateShippingRequestDto {
  @ApiProperty({
    description: 'The tracking code for the shipping',
    example: 'TRACK123456',
  })
  trackingCode?: string;

  @ApiProperty({
    description: 'The date when the item was shipped',
    example: '2023-10-01T12:00:00Z',
  })
  shippedAt?: Date;

  @ApiProperty({
    description: 'The date when the item was delivered',
    example: '2023-10-05T12:00:00Z',
  })
  deliveredAt?: Date;

  @ApiProperty({
    description: 'The ID of the shipping method used for this shipping',
    example: 1,
  })
  shippingMethodId: bigint;
}
