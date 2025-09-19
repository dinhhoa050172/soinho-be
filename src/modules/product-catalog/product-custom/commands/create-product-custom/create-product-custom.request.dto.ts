import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductCustomRequestDto {
  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  characterName: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  characterDesign: string;

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
    example: '',
    description: '',
  })
  @IsOptional()
  note: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'List of accessories',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  accessory: string[];

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
