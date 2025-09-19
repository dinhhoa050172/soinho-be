import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/libs/application/validator/prisma-filter.validator';

export class FindProductsByNameRequestDto extends FilterDto<Prisma.ProductWhereInput> {
  // Add more properties here
}
