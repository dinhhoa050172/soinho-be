import { ApiProperty } from '@nestjs/swagger';
import { StatusShipping } from '@prisma/client';

export class UpdateShippingStatusRequestDto {
  @ApiProperty({
    description: 'Status of the shipping',
    example: StatusShipping.IN_TRANSIT,
  })
  status: StatusShipping;
}
