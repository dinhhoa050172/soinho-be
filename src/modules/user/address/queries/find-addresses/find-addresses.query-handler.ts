import { Prisma } from '@prisma/client';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { AddressEntity } from '../../domain/address.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ADDRESS_REPOSITORY } from '../../address.di-tokens';
import { AddressRepositoryPort } from '../../database/address.repository.port';
import { GeneratedFindOptions } from '@chax-at/prisma-filter';

export class FindAddresssQuery extends PrismaPaginatedQueryBase<Prisma.AddressWhereInput> {
  userEmail: string;
  constructor(
    params: GeneratedFindOptions<Prisma.AddressWhereInput>,
    userEmail: string,
  ) {
    super(params);
    this.userEmail = userEmail;
  }
}

export type FindAddresssQueryResult = Result<Paginated<AddressEntity>, void>;

@QueryHandler(FindAddresssQuery)
export class FindAddresssQueryHandler
  implements IQueryHandler<FindAddresssQuery>
{
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    protected readonly addressRepo: AddressRepositoryPort,
  ) {}

  async execute(query: FindAddresssQuery): Promise<FindAddresssQueryResult> {
    const { userEmail, where, ...restQuery } = query;
    const result = await this.addressRepo.findAllPaginated({
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
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
