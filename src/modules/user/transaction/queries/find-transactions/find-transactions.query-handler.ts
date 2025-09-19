import { Prisma } from '@prisma/client';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { TransactionEntity } from '../../domain/transaction.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../../transaction.di-tokens';
import { TransactionRepositoryPort } from '../../database/transaction.repository.port';
import { GeneratedFindOptions } from '@chax-at/prisma-filter';

export class FindTransactionsQuery extends PrismaPaginatedQueryBase<Prisma.TransactionWhereInput> {
  userEmail: string;
  constructor(
    params: GeneratedFindOptions<Prisma.TransactionWhereInput>,
    userEmail: string,
  ) {
    super(params);
    this.userEmail = userEmail;
  }
}

export type FindTransactionsQueryResult = Result<
  Paginated<TransactionEntity>,
  void
>;

@QueryHandler(FindTransactionsQuery)
export class FindTransactionsQueryHandler
  implements IQueryHandler<FindTransactionsQuery>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    protected readonly transactionRepo: TransactionRepositoryPort,
  ) {}

  async execute(
    query: FindTransactionsQuery,
  ): Promise<FindTransactionsQueryResult> {
    const result = await this.transactionRepo.findAllPaginated(query);
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
