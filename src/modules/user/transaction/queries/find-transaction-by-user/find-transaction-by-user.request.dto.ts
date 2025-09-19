import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/libs/application/validator/prisma-filter.validator';

export class FindTransactionByUserRequestDto extends FilterDto<Prisma.TransactionWhereInput> {}
