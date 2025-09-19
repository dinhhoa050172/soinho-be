import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PaymentRepositoryPort } from '../../database/payment.repository.port';
import { PaymentEntity } from '../../domain/payment.entity';
import { PaymentNotFoundError } from '../../domain/payment.error';
import { PAYMENT_REPOSITORY } from '../../payment.di-tokens';

export class FindPaymentQuery {
  paymentId: bigint;

  constructor(public readonly id: bigint) {
    this.paymentId = id;
  }
}

export type FindPaymentQueryResult = Result<
  PaymentEntity,
  PaymentNotFoundError
>;

@QueryHandler(FindPaymentQuery)
export class FindPaymentQueryHandler
  implements IQueryHandler<FindPaymentQuery>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    protected readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  async execute(query: FindPaymentQuery): Promise<FindPaymentQueryResult> {
    const found = await this.paymentRepo.findOneById(query.paymentId);
    if (found.isNone()) return Err(new PaymentNotFoundError());

    return Ok(found.unwrap());
  }
}
