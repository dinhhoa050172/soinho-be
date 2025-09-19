import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCategoryRequestDto } from '../create-category/create-category.request.dto';
import { IsOptional } from 'class-validator';

export class UpdateCategoryRequestDto extends PartialType(
  CreateCategoryRequestDto,
) {
  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái',
  })
  @IsOptional()
  isActive?: boolean;
}
