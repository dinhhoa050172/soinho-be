import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { ProductImageRepositoryPort } from '../../database/product-image.repository.port';
import { ProductImageEntity } from '../../domain/product-image.entity';
import { ProductImageNotFoundError } from '../../domain/product-image.error';
import { PRODUCT_IMAGE_REPOSITORY } from '../../product-image.di-tokens';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class FindProductImageQuery {
  productId: bigint;

  constructor(public readonly id: bigint) {
    this.productId = id;
  }
}

export type FindProductImageQueryResult = Result<
  ProductImageEntity,
  ProductImageNotFoundError
>;

@QueryHandler(FindProductImageQuery)
export class FindProductImageQueryHandler
  implements IQueryHandler<FindProductImageQuery>
{
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    protected readonly productRepo: ProductImageRepositoryPort,
  ) {}

  async execute(query: FindProductImageQuery): Promise<FindProductImageQueryResult> {
    const found = await this.productRepo.findOneById(query.productId);
    if (found.isNone()) return Err(new ProductImageNotFoundError());

    return Ok(found.unwrap());
  }
}
