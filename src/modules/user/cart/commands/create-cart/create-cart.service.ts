import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CartRepositoryPort } from '../../database/cart.repository.port';
import { CartEntity } from '../../domain/cart.entity';
import { CreateCartCommand } from './create-cart.command';
import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException, Inject } from '@nestjs/common';
import { CART_REPOSITORY } from '../../cart.di-tokens';
import { CartAlreadyExistsError } from '../../domain/cart.error';

export type CreateCartServiceResult = Result<CartEntity, any>;

@CommandHandler(CreateCartCommand)
export class CreateCartService implements ICommandHandler<CreateCartCommand> {
  constructor(
    @Inject(CART_REPOSITORY)
    protected readonly cartRepo: CartRepositoryPort,
  ) {}

  async execute(command: CreateCartCommand): Promise<CreateCartServiceResult> {
    const cart = CartEntity.create({
      ...command.getExtendedProps<CreateCartCommand>(),
      items: [],
    });

    try {
      const createdCart = await this.cartRepo.insert(cart);
      return Ok(createdCart);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new CartAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
