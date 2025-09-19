import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CartNotFoundError } from '../../domain/cart.error';
import { CART_REPOSITORY } from '../../cart.di-tokens';
import { CartRepositoryPort } from '../../database/cart.repository.port';
import { ClearCartCommand } from './clear-cart.command';

export type ClearCartServiceResult = Result<boolean, CartNotFoundError>;

@CommandHandler(ClearCartCommand)
export class ClearCartService implements ICommandHandler<ClearCartCommand> {
  constructor(
    @Inject(CART_REPOSITORY)
    protected readonly cartRepo: CartRepositoryPort,
  ) {}

  async execute(command: ClearCartCommand): Promise<ClearCartServiceResult> {
    try {
      const optionCart = await this.cartRepo.findOneById(command.cartId);
      if (optionCart.isNone()) return Err(new CartNotFoundError());

      const cart = optionCart.unwrap();
      cart.clearItems();

      await this.cartRepo.clearCartItems(cart.id);

      return Ok(true);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new CartNotFoundError(error));
      }

      throw error;
    }
  }
}
