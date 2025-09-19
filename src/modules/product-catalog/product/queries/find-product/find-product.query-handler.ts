import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { ProductRepositoryPort } from '../../database/product.repository.port';
import { ProductEntity } from '../../domain/product.entity';
import { ProductNotFoundError } from '../../domain/product.error';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindProductQuery {
  productId: bigint;

  constructor(public readonly id: bigint) {
    this.productId = id;
  }
}

export type FindProductQueryResult = Result<
  ProductEntity,
  ProductNotFoundError
>;

@QueryHandler(FindProductQuery)
export class FindProductQueryHandler
  implements IQueryHandler<FindProductQuery>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    protected readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(query: FindProductQuery): Promise<FindProductQueryResult> {
    const found = await this.productRepo.findOneById(query.productId, {
      ProductImage: true,
      Category: true,
      Material: true,
    });
    if (found.isNone()) return Err(new ProductNotFoundError());

    return Ok(found.unwrap());
  }
}
