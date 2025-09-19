import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/libs/application/validator/prisma-filter.validator';

export class FindProductCustomsRequestDto extends FilterDto<Prisma.ProductCustomWhereInput> {
  // Add more properties here
}
