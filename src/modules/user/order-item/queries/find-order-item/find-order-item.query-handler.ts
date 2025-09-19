import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ORDER_ITEM_REPOSITORY } from '../../order-item.di-tokens';
import { OrderItemRepositoryPort } from '../../database/order-item.repository.port';
import { OrderItemEntity } from '../../domain/order-item.entity';
import { OrderItemNotFoundError } from '../../domain/order-item.error';

export class FindOrderItemQuery {
  orderItemId: bigint;

  constructor(public readonly id: bigint) {
    this.orderItemId = id;
  }
}

export type FindOrderItemQueryResult = Result<
  OrderItemEntity,
  OrderItemNotFoundError
>;

@QueryHandler(FindOrderItemQuery)
export class FindOrderItemQueryHandler
  implements IQueryHandler<FindOrderItemQuery>
{
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY)
    protected readonly orderItemRepo: OrderItemRepositoryPort,
  ) {}

  async execute(query: FindOrderItemQuery): Promise<FindOrderItemQueryResult> {
    const found = await this.orderItemRepo.findOneById(query.orderItemId);
    if (found.isNone()) return Err(new OrderItemNotFoundError());

    return Ok(found.unwrap());
  }
}
