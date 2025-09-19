import { ApiProperty } from '@nestjs/swagger';
import { StatusOrder } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderRequestDto {
  @ApiProperty({
    description: 'Status of the order',
    example: 'PENDING',
  })
  @IsNotEmpty()
  status: StatusOrder;
}
