import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SHIPPING_REPOSITORY } from '../../shipping.di-tokens';
import { ShippingRepositoryPort } from '../../database/shipping.repository.port';
import { ShippingEntity } from '../../domain/shipping.entity';
import { ShippingAlreadyExistsError } from '../../domain/shipping.error';
import { CreateShippingCommand } from './create-shipping.command';

export type CreateShippingServiceResult = Result<ShippingEntity, any>;

@CommandHandler(CreateShippingCommand)
export class CreateShippingService
  implements ICommandHandler<CreateShippingCommand>
{
  constructor(
    @Inject(SHIPPING_REPOSITORY)
    protected readonly shippingRepo: ShippingRepositoryPort,
  ) {}

  async execute(
    command: CreateShippingCommand,
  ): Promise<CreateShippingServiceResult> {
    const shipping = ShippingEntity.create({
      ...command.getExtendedProps<CreateShippingCommand>(),
    });

    try {
      const createdShipping = await this.shippingRepo.insert(shipping);
      return Ok(createdShipping);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ShippingAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
