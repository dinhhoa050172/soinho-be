import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateProductRequestDto {
  // Add more properties here
  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  price: Prisma.Decimal | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  height: Prisma.Decimal | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  width: Prisma.Decimal | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  length: Prisma.Decimal | null;

  @ApiPropertyOptional({
    example: 20,
    description: '',
  })
  @IsOptional()
  @IsNumber(undefined, {
    message: 'Stock quantity must be a number',
  })
  stockQty: number | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  description: string | null;

  @ApiPropertyOptional({
    example: true,
    description: '',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  categoryId: bigint | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  materialId: bigint | null;

  @ApiPropertyOptional({
    type: [String],
    description: 'List of product images',
    isArray: true,
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  images?: string[];
}
