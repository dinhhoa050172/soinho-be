import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductRequestDto } from '../create-product/create-product.request.dto';
import { IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductImage {
  url: string;
  isThumbnail?: boolean;
}
export class UpdateProductRequestDto extends OmitType(
  PartialType(CreateProductRequestDto),
  ['images'],
) {
  // Add more properties here

  @ApiPropertyOptional({
    type: [ProductImage],
    description: 'List of product images',
    isArray: true,
    example: [{ url: 'https://example.com/image1.jpg', isThumbnail: true }],
  })
  @IsOptional()
  @IsArray()
  @Type(() => ProductImage)
  images?: ProductImage[];
}
