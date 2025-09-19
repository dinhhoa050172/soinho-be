import { PartialType } from '@nestjs/swagger';
import { CreateProductImageRequestDto } from '../create-product-image/create-product-image.request.dto';

export class UpdateProductImageRequestDto extends PartialType(
  CreateProductImageRequestDto,
) {
  // Add more properties here
}
