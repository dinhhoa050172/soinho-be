import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { CartNotFoundError } from '../../domain/cart.error';
import { CART_REPOSITORY } from '../../cart.di-tokens';
import { CartRepositoryPort } from '../../database/cart.repository.port';
import { CartEntity } from '../../domain/cart.entity';

export class FindCartByUserIdQuery {
  userId: bigint;

  constructor(public readonly id: bigint) {
    this.userId = id;
  }
}

export type FindCartByUserIdQueryResult = Result<CartEntity, CartNotFoundError>;

@QueryHandler(FindCartByUserIdQuery)
export class FindCartByUserIdQueryHandler
  implements IQueryHandler<FindCartByUserIdQuery>
{
  constructor(
    @Inject(CART_REPOSITORY)
    protected readonly cartRepo: CartRepositoryPort,
  ) {}

  async execute(
    query: FindCartByUserIdQuery,
  ): Promise<FindCartByUserIdQueryResult> {
    const found = await this.cartRepo.findCartWithItems(query.userId);
    if (found.isNone()) return Err(new CartNotFoundError());

    return Ok(found.unwrap());
  }
}
