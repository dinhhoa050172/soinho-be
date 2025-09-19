import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { ProductRepositoryPort } from '../../database/product.repository.port';
import { ProductEntity } from '../../domain/product.entity';
import { ProductNotFoundError } from '../../domain/product.error';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';

export class FindProductBySlugQuery {
  productSlug: string;

  constructor(public readonly slug: string) {
    this.productSlug = slug;
  }
}

export type FindProductBySlugQueryResult = Result<
  ProductEntity,
  ProductNotFoundError
>;

@QueryHandler(FindProductBySlugQuery)
export class FindProductBySlugQueryHandler
  implements IQueryHandler<FindProductBySlugQuery>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    protected readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(
    query: FindProductBySlugQuery,
  ): Promise<FindProductBySlugQueryResult> {
    const found =
      await this.productRepo.findOneByParams<Prisma.ProductWhereInput>({
        where: { slug: query.productSlug },
        include: { ProductImage: true, Category: true, Material: true },
      });
    if (found.isNone()) return Err(new ProductNotFoundError());

    return Ok(found.unwrap());
  }
}
