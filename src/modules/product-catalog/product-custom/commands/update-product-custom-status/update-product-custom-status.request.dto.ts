import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { ProductCustomStatus } from '../../domain/product-custom.type';
import { Prisma } from '@prisma/client';

export class UpdateProductCustomStatusRequestDto {
  @ApiPropertyOptional({
    example: ProductCustomStatus.ACCEPTED,
    description: 'Trạng thái',
    enum: ProductCustomStatus,
  })
  @IsOptional()
  @IsEnum(ProductCustomStatus, {
    message: `Trạng thái không hợp lệ. Chỉ chấp nhận: ${Object.values(ProductCustomStatus).join(', ')}`,
  })
  status?: ProductCustomStatus | null;

  @ApiPropertyOptional({
    example: '',
    description: 'Giá tiền',
  })
  @IsOptional()
  price?: Prisma.Decimal | null;

  @ApiPropertyOptional({
    example: [
      'https://example.com/images/return1.jpg',
      'https://example.com/images/return2.jpg',
    ],
    description: 'Danh sách ảnh sản phẩm trả lại (nếu có)',
  })
  @IsOptional()
  @IsArray()
  imageReturn?: string[] | null;

  @ApiPropertyOptional({
    example: '',
    description: 'Ghi chú',
  })
  @IsOptional()
  note?: string | null;
}
