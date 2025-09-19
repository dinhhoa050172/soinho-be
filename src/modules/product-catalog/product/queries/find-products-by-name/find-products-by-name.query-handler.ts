import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductEntity } from '../../domain/product.entity';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';
import { ProductRepositoryPort } from '../../database/product.repository.port';
import { Prisma } from '.prisma/client/default';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { GeneratedFindOptions } from '@chax-at/prisma-filter';

export class FindProductsByNameQuery extends PrismaPaginatedQueryBase<Prisma.ProductWhereInput> {
  name: string;
  constructor(
    props: GeneratedFindOptions<Prisma.ProductWhereInput> & {
      name: string;
    },
  ) {
    super(props);
    this.name = props.name;
  }
}

export type FindProductsByNameQueryResult = Result<
  Paginated<ProductEntity>,
  void
>;

@QueryHandler(FindProductsByNameQuery)
export class FindProductsByNameQueryHandler
  implements IQueryHandler<FindProductsByNameQuery>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    protected readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(
    query: FindProductsByNameQuery,
  ): Promise<FindProductsByNameQueryResult> {
    const result = await this.productRepo.findProductByParamsPaginated(
      {
        ...query,
        where: {
          name: {
            contains: query.name,
            mode: 'insensitive',
          },
        },
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
