import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ResponseBase } from 'src/libs/api/response.base';
import { ProductImageResponseDto } from '../../product-image/dtos/product-image.response.dto';

export class ProductCustomResponseDto extends ResponseBase<any> {
  @ApiProperty({
    example: '',
    description: '',
  })
  characterName: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  characterDesign: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  height: Prisma.Decimal | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  width: Prisma.Decimal | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  length: Prisma.Decimal | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  note: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  accessory: string[] | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  status: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  price: Prisma.Decimal | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  imageReturn: string[] | null;

  @ApiProperty({
    example: true,
    description: '',
  })
  isActive: boolean;

  @ApiProperty({
    example: 1,
    description: '',
  })
  userId: number;

  // @ApiProperty({
  //   example: [],
  // })
  // materials: MaterialResponseDto[] | null;

  @ApiProperty({
    example: [],
  })
  productImages: ProductImageResponseDto[] | null;
}
