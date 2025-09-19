import { Prisma } from '@prisma/client';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { OrderEntity } from '../../domain/order.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderRepositoryPort } from '../../database/order.repository.port';
import { ORDER_REPOSITORY } from '../../order.di-tokens';

export class FindOrdersQuery extends PrismaPaginatedQueryBase<Prisma.OrderWhereInput> {}

export type FindOrdersQueryResult = Result<Paginated<OrderEntity>, void>;

@QueryHandler(FindOrdersQuery)
export class FindOrdersQueryHandler implements IQueryHandler<FindOrdersQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    protected readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute(query: FindOrdersQuery): Promise<FindOrdersQueryResult> {
    const result = await this.orderRepo.findAllPaginated(query, {
      payment: true,
    });
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
