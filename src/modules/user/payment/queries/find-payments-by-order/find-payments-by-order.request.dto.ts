import { Prisma } from '@prisma/client';
import { FilterDto } from 'src/libs/application/validator/prisma-filter.validator';

export class FindPaymentsByOrderRequestDto extends FilterDto<Prisma.PaymentWhereInput> {}
