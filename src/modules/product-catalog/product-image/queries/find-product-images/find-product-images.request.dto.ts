import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/libs/application/validator/prisma-filter.validator';

export class FindProductImagesRequestDto extends FilterDto<Prisma.ProductImageWhereInput> {
  // Add more properties here
}
