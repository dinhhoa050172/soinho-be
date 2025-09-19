import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';
import { ProductCustomRepositoryPort } from '../../database/product-custom.repository.port';
import { ProductCustomEntity } from '../../domain/product-custom.entity';
import { PRODUCT_CUSTOM_REPOSITORY } from '../../product-custom.di-token';
import { GeneratedFindOptions } from '@chax-at/prisma-filter';

export class FindProductCustomsByCurrentUserQuery extends PrismaPaginatedQueryBase<Prisma.ProductCustomWhereInput> {
  userId: bigint;
  constructor(
    props: GeneratedFindOptions<Prisma.ProductCustomWhereInput> & {
      userId: bigint;
    },
  ) {
    super(props);
    this.userId = props.userId;
  }
}

export type FindProductCustomsByCurrentUserQueryResult = Result<
  Paginated<ProductCustomEntity>,
  void
>;

@QueryHandler(FindProductCustomsByCurrentUserQuery)
export class FindProductCustomsByCurrentUserQueryHandler
  implements IQueryHandler<FindProductCustomsByCurrentUserQuery>
{
  constructor(
    @Inject(PRODUCT_CUSTOM_REPOSITORY)
    protected readonly productCustomRepo: ProductCustomRepositoryPort,
  ) {}

  async execute(
    query: FindProductCustomsByCurrentUserQuery,
  ): Promise<FindProductCustomsByCurrentUserQueryResult> {
    const result = await this.productCustomRepo.findAllPaginated(
      {
        where: { userId: query.userId },
        limit: query.limit,
        page: query.page,
        offset: query.offset,
        orderBy: query.orderBy,
      },
      {
        ProductImage: true,
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
