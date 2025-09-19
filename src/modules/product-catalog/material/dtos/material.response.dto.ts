import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ResponseBase } from 'src/libs/api/response.base';

export class MaterialResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '',
    description: '',
  })
  name: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  unit: string;

  @ApiProperty({
    example: 0,
    description: '',
  })
  stockQty: number;

  @ApiProperty({
    example: 0,
    description: '',
  })
  thresholdQty: number;

  @ApiProperty({
    example: '0.00',
    description: '',
  })
  price: Prisma.Decimal | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  color: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  description: string | null;

  @ApiProperty({
    example: true,
    description: '',
  })
  isActive: boolean;
}
