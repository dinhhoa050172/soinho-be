import { Ok, Result } from 'oxide.ts';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from '../../payment.di-tokens';
import { PaymentRepositoryPort } from '../../database/payment.repository.port';
import { PaymentEntity } from '../../domain/payment.entity';

export class FindPaymentsByOrderQuery {
  constructor(readonly orderId?: bigint) {}
}

export type FindPaymentsByOrderQueryResult = Result<PaymentEntity[], void>;

@QueryHandler(FindPaymentsByOrderQuery)
export class FindPaymentsByOrderQueryHandler
  implements IQueryHandler<FindPaymentsByOrderQuery>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    protected readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  async execute(
    query: FindPaymentsByOrderQuery,
  ): Promise<FindPaymentsByOrderQueryResult> {
    const { orderId } = query;

    const result = await this.paymentRepo.findAll({
      orderId,
    });
    return Ok(result);
  }
}
