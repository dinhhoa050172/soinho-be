import { Prisma } from '@prisma/client';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { OrderEntity } from '../../domain/order.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderRepositoryPort } from '../../database/order.repository.port';
import { ORDER_REPOSITORY } from '../../order.di-tokens';
import { GeneratedFindOptions } from '@chax-at/prisma-filter';

export class FindOrdersByUserQuery extends PrismaPaginatedQueryBase<Prisma.OrderWhereInput> {
  userId: bigint;
  constructor(
    params: GeneratedFindOptions<Prisma.OrderWhereInput> & {
      userId: bigint;
    },
  ) {
    super(params);
    this.userId = params.userId;
  }
}

export type FindOrdersByUserQueryResult = Result<Paginated<OrderEntity>, void>;

@QueryHandler(FindOrdersByUserQuery)
export class FindOrdersByUserQueryHandler
  implements IQueryHandler<FindOrdersByUserQuery>
{
  constructor(
    @Inject(ORDER_REPOSITORY)
    protected readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute(
    query: FindOrdersByUserQuery,
  ): Promise<FindOrdersByUserQueryResult> {
    const { where, userId, ...rest } = query;

    const result = await this.orderRepo.findAllPaginated(
      {
        ...rest,
        where: {
          ...where,
          userId: userId,
        },
      },
      {
        payment: true,
      },
    );
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
