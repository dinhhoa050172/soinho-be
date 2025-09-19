import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';
import { ProductCustomRepositoryPort } from '../../database/product-custom.repository.port';
import { ProductCustomEntity } from '../../domain/product-custom.entity';
import { PRODUCT_CUSTOM_REPOSITORY } from '../../product-custom.di-token';

export class FindProductCustomsQuery extends PrismaPaginatedQueryBase<Prisma.ProductCustomWhereInput> {}

export type FindProductCustomsQueryResult = Result<
  Paginated<ProductCustomEntity>,
  void
>;

@QueryHandler(FindProductCustomsQuery)
export class FindProductCustomsQueryHandler
  implements IQueryHandler<FindProductCustomsQuery>
{
  constructor(
    @Inject(PRODUCT_CUSTOM_REPOSITORY)
    protected readonly productCustomRepo: ProductCustomRepositoryPort,
  ) {}

  async execute(
    query: FindProductCustomsQuery,
  ): Promise<FindProductCustomsQueryResult> {
    const result = await this.productCustomRepo.findAllPaginated(query, {
      ProductImage: true,
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
