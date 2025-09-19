import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductImageRequestDto {
  // Add more properties here
  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  isThumbnail: boolean;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  productId: bigint;

  @ApiPropertyOptional({
    example: '',
    description: '',
  })
  @IsOptional()
  productCustomId: bigint | null;
}
