import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/libs/application/validator/prisma-filter.validator';

export class FindProductsRequestDto extends FilterDto<Prisma.ProductWhereInput> {
  // Add more properties here
}
