import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CartNotFoundError } from '../../domain/cart.error';
import { CART_REPOSITORY } from '../../cart.di-tokens';
import { CartRepositoryPort } from '../../database/cart.repository.port';
import { RemoveItemFromCartCommand } from './remove-item-from-cart.command';

export type RemoveItemFromCartServiceResult = Result<
  boolean,
  CartNotFoundError
>;

@CommandHandler(RemoveItemFromCartCommand)
export class RemoveItemFromCartService
  implements ICommandHandler<RemoveItemFromCartCommand>
{
  constructor(
    @Inject(CART_REPOSITORY)
    protected readonly cartRepo: CartRepositoryPort,
  ) {}

  async execute(
    command: RemoveItemFromCartCommand,
  ): Promise<RemoveItemFromCartServiceResult> {
    try {
      const optionCart = await this.cartRepo.findOneById(command.cartId);
      if (optionCart.isNone()) return Err(new CartNotFoundError());

      const cart = optionCart.unwrap();
      cart.removeItem(command.productId);

      await this.cartRepo.removeItemFromCart(
        cart.getProps().id,
        command.productId,
      );

      return Ok(true);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new CartNotFoundError(error));
      }
      throw error;
    }
  }
}
