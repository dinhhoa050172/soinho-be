import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateAddressRequestDto {
  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(20)
  phone?: string | null;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(255)
  street: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  ward?: string | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  district?: string | null;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(100)
  province?: string | null;

  @ApiProperty({
    example: 'Vietnam',
    description: '',
  })
  @IsNotEmpty()
  @MaxLength(100)
  country: string;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  @MaxLength(20)
  postalCode?: string | null;

  @ApiPropertyOptional({
    example: true,
    description: 'Địa chỉ này có phải là địa chỉ mặc định không',
  })
  @IsOptional()
  @IsBoolean()
  isDefault: boolean;
}
