import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CartAlreadyInUseError,
  CartNotFoundError,
} from '../../domain/cart.error';
import { CART_REPOSITORY } from '../../cart.di-tokens';
import { CartRepositoryPort } from '../../database/cart.repository.port';
import { CartEntity } from '../../domain/cart.entity';
import { UpdateItemQuantityCommand } from './update-item-quantity.command';

export type UpdateItemQuantityServiceResult = Result<CartEntity, any>;

@CommandHandler(UpdateItemQuantityCommand)
export class UpdateItemQuantityService
  implements ICommandHandler<UpdateItemQuantityCommand>
{
  constructor(
    @Inject(CART_REPOSITORY)
    protected readonly cartRepo: CartRepositoryPort,
  ) {}

  async execute(
    command: UpdateItemQuantityCommand,
  ): Promise<UpdateItemQuantityServiceResult> {
    const cartOption = await this.cartRepo.findOneById(command.cartId);
    if (cartOption.isNone()) return Err(new CartNotFoundError());

    const cart = cartOption.unwrap();
    cart.updateItemQuantity(command.productId, command.quantity);

    try {
      const updatedCart = await this.cartRepo.updateItemQuantity(
        command.cartId,
        command.productId,
        command.quantity,
      );
      return Ok(updatedCart);
    } catch (error) {
      if (error instanceof ConflictException) {
        return Err(new CartAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
