import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateMaterialRequestDto {
  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(100)
  unit: string;

  @ApiProperty({
    example: 0,
    description: '',
  })
  @IsNotEmpty()
  @IsNumber()
  stockQty: number;

  @ApiPropertyOptional({
    example: 0,
    description: '',
  })
  @IsOptional()
  @IsNumber()
  thresholdQty: number;

  @ApiPropertyOptional({
    example: '0.00',
    description: '',
  })
  @IsOptional()
  @IsDecimal()
  price: Prisma.Decimal | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(20)
  color: string | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  description: string | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
