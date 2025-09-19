import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ResponseBase } from 'src/libs/api/response.base';
import { ProductImageResponseDto } from '../../product-image/dtos/product-image.response.dto';

export class ProductResponseDto extends ResponseBase<any> {
  // Add properties here
  @ApiProperty({
    example: '',
    description: '',
  })
  slug: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  name: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  price: Prisma.Decimal | null;

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
  stockQty: number | null;

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

  @ApiProperty({
    example: '',
    description: '',
  })
  categoryName: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  materialName: string | null;

  @ApiProperty({
    example: [],
  })
  productImages: ProductImageResponseDto[] | null;
}
