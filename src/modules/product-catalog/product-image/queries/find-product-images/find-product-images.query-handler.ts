import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';
import { ProductImageEntity } from '../../domain/product-image.entity';
import { PRODUCT_IMAGE_REPOSITORY } from '../../product-image.di-tokens';
import { ProductImageRepositoryPort } from '../../database/product-image.repository.port';

export class FindProductImagesQuery extends PrismaPaginatedQueryBase<Prisma.ProductImageWhereInput> {}

export type FindProductImagesQueryResult = Result<
  Paginated<ProductImageEntity>,
  void
>;

@QueryHandler(FindProductImagesQuery)
export class FindProductImagesQueryHandler
  implements IQueryHandler<FindProductImagesQuery, FindProductImagesQueryResult>
{
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    protected readonly productRepo: ProductImageRepositoryPort,
  ) {}

  async execute(
    query: FindProductImagesQuery,
  ): Promise<FindProductImagesQueryResult> {
    const result = await this.productRepo.findAllPaginated(query);

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
