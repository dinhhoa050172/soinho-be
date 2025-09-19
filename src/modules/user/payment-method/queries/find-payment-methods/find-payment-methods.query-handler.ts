import { Prisma } from '@prisma/client';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PaymentMethodRepositoryPort } from '../../database/payment-method.repository.port';
import { PaymentMethodEntity } from '../../domain/payment-method.entity';
import { PAYMENT_METHOD_REPOSITORY } from '../../payment-method.di-tokens';

export class FindPaymentMethodsQuery extends PrismaPaginatedQueryBase<Prisma.PaymentMethodWhereInput> {}

export type FindPaymentMethodsQueryResult = Result<
  Paginated<PaymentMethodEntity>,
  void
>;

@QueryHandler(FindPaymentMethodsQuery)
export class FindPaymentMethodsQueryHandler
  implements IQueryHandler<FindPaymentMethodsQuery>
{
  constructor(
    @Inject(PAYMENT_METHOD_REPOSITORY)
    protected readonly paymentMethodRepo: PaymentMethodRepositoryPort,
  ) {}

  async execute(
    query: FindPaymentMethodsQuery,
  ): Promise<FindPaymentMethodsQueryResult> {
    const result = await this.paymentMethodRepo.findAllPaginated(query);
    return Ok(
      new Paginated({
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
