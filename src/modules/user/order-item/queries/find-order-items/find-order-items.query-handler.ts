import { Prisma } from '@prisma/client';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { OrderItemEntity } from '../../domain/order-item.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ORDER_ITEM_REPOSITORY } from '../../order-item.di-tokens';
import { OrderItemRepositoryPort } from '../../database/order-item.repository.port';

export class FindOrderItemsQuery extends PrismaPaginatedQueryBase<Prisma.OrderItemWhereInput> {}

export type FindOrderItemsQueryResult = Result<
  Paginated<OrderItemEntity>,
  void
>;

@QueryHandler(FindOrderItemsQuery)
export class FindOrderItemsQueryHandler
  implements IQueryHandler<FindOrderItemsQuery>
{
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY)
    protected readonly orderItemRepo: OrderItemRepositoryPort,
  ) {}

  async execute(
    query: FindOrderItemsQuery,
  ): Promise<FindOrderItemsQueryResult> {
    const result = await this.orderItemRepo.findAllPaginated(query);
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
