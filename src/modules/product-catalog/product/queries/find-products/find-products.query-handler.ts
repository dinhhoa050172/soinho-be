import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';
import { ProductEntity } from '../../domain/product.entity';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';
import { ProductRepositoryPort } from '../../database/product.repository.port';
import { GeneratedFindOptions } from '@chax-at/prisma-filter';

export class FindProductsQuery extends PrismaPaginatedQueryBase<Prisma.ProductWhereInput> {
  categoryName?: string;
  materialName?: string;
  constructor(
    props: GeneratedFindOptions<Prisma.ProductWhereInput> & {
      categoryName?: string;
      materialName?: string;
    },
  ) {
    super(props);
    this.categoryName = props.categoryName;
    this.materialName = props.materialName;
  }
}

export type FindProductsQueryResult = Result<Paginated<ProductEntity>, void>;

@QueryHandler(FindProductsQuery)
export class FindProductsQueryHandler
  implements IQueryHandler<FindProductsQuery, FindProductsQueryResult>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    protected readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(query: FindProductsQuery): Promise<FindProductsQueryResult> {
    const result =
      await this.productRepo.findProductByCategoryMaterialNamePaginated(
        query,
        query.categoryName,
        query.materialName,
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
