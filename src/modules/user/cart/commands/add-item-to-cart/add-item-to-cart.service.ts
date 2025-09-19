import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CartAlreadyExistsError } from '../../domain/cart.error';
import { CART_REPOSITORY } from '../../cart.di-tokens';
import { CartRepositoryPort } from '../../database/cart.repository.port';
import { CartEntity } from '../../domain/cart.entity';
import { AddItemToCartCommand } from './add-item-to-cart.command';

export type AddItemToCartServiceResult = Result<CartEntity, any>;

@CommandHandler(AddItemToCartCommand)
export class AddItemToCartService
  implements ICommandHandler<AddItemToCartCommand>
{
  constructor(
    @Inject(CART_REPOSITORY)
    protected readonly cartRepo: CartRepositoryPort,
  ) {}

  async execute(
    command: AddItemToCartCommand,
  ): Promise<AddItemToCartServiceResult> {
    const { userId, productId, quantity, price } = command;

    const cartOption = await this.cartRepo.findCartByParams({
      where: { userId },
    });

    let cart: CartEntity;

    if (cartOption.isNone()) {
      cart = CartEntity.create({
        ...command.getExtendedProps<AddItemToCartCommand>(),
        items: [{ productId, quantity, price }],
      });

      try {
        const createdAddress = await this.cartRepo.insertCartWithItem(cart);
        return Ok(createdAddress);
      } catch (error: any) {
        if (error instanceof ConflictException) {
          return Err(new CartAlreadyExistsError(error));
        }
        throw error;
      }
    } else {
      cart = cartOption.unwrap();
      cart.addItem(productId, quantity, price);

      const updatedCart = await this.cartRepo.insertItemToCart(
        cart.id,
        productId,
        quantity,
        price,
        cart.getProps().createdBy,
      );
      return Ok(updatedCart);
    }
  }
}
