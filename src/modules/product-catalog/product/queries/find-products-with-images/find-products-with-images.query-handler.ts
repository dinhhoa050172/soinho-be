import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';
import { ProductEntity } from '../../domain/product.entity';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';
import { ProductRepositoryPort } from '../../database/product.repository.port';

export class FindProductsWithImagesQuery extends PrismaPaginatedQueryBase<Prisma.ProductWhereInput> {}

export type FindProductsWithImagesQueryResult = Result<
  Paginated<ProductEntity>,
  void
>;

@QueryHandler(FindProductsWithImagesQuery)
export class FindProductsWithImagesQueryHandler
  implements
    IQueryHandler<
      FindProductsWithImagesQuery,
      FindProductsWithImagesQueryResult
    >
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    protected readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(
    query: FindProductsWithImagesQuery,
  ): Promise<FindProductsWithImagesQueryResult> {
    const result = await this.productRepo.findProductByParamsPaginated(query, {
      ProductImage: true,
      Category: true,
      Material: true,
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
