import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryRequestDto {
  @ApiProperty({
    example: 'Móc khóa len',
    description: 'Danh mục sản phẩm',
  })
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Mô tả danh mục sản phẩm',
  })
  @IsOptional()
  desc: string | null;
}
