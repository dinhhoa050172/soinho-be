import { Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TRANSACTION_REPOSITORY } from '../../transaction.di-tokens';
import { TransactionRepositoryPort } from '../../database/transaction.repository.port';
import { TransactionEntity } from '../../domain/transaction.entity';
import { TransactionNotFoundError } from '../../domain/transaction.error';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';
import { GeneratedFindOptions } from '@chax-at/prisma-filter';
import { Paginated } from 'src/libs/ddd';

export class FindTransactionByUserQuery extends PrismaPaginatedQueryBase<Prisma.TransactionWhereInput> {
  userEmail: string;
  constructor(
    params: GeneratedFindOptions<Prisma.TransactionWhereInput>,
    userEmail: string,
  ) {
    super(params);
    this.userEmail = userEmail;
  }
}

export type FindTransactionByUserQueryResult = Result<
  Paginated<TransactionEntity>,
  TransactionNotFoundError
>;

@QueryHandler(FindTransactionByUserQuery)
export class FindTransactionByUserQueryHandler
  implements IQueryHandler<FindTransactionByUserQuery>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    protected readonly transactionRepo: TransactionRepositoryPort,
  ) {}

  async execute(
    query: FindTransactionByUserQuery,
  ): Promise<FindTransactionByUserQueryResult> {
    const { userEmail, where, ...restQuery } = query;
    const found = await this.transactionRepo.findAllPaginated({
      ...restQuery,
      where: {
        ...where,
        user: {
          email: userEmail,
        },
      },
    });

    return Ok(
      new Paginated({
        data: found.data,
        count: found.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
