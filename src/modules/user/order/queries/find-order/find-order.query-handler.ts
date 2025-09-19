import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ORDER_REPOSITORY } from '../../order.di-tokens';
import { OrderRepositoryPort } from '../../database/order.repository.port';
import { OrderEntity } from '../../domain/order.entity';
import { OrderNotFoundError } from '../../domain/order.error';

export class FindOrderQuery {
  orderId: bigint;

  constructor(public readonly id: bigint) {
    this.orderId = id;
  }
}

export type FindOrderQueryResult = Result<OrderEntity, OrderNotFoundError>;

@QueryHandler(FindOrderQuery)
export class FindOrderQueryHandler implements IQueryHandler<FindOrderQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    protected readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute(query: FindOrderQuery): Promise<FindOrderQueryResult> {
    const found = await this.orderRepo.findOneById(query.orderId);
    if (found.isNone()) return Err(new OrderNotFoundError());

    return Ok(found.unwrap());
  }
}
