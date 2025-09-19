import { Err, Ok, Result } from 'oxide.ts';

import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrderRepositoryPort } from '../../database/order.repository.port';
import { OrderEntity } from '../../domain/order.entity';
import { ORDER_REPOSITORY } from '../../order.di-tokens';
import { UpdateOrderCommand } from './update-order.command';
import { ConflictException } from 'src/libs/exceptions';
import { OrderAlreadyInUseError } from '../../domain/order.error';

export type UpdateOrderServiceResult = Result<
  OrderEntity,
  OrderAlreadyInUseError
>;

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderService implements ICommandHandler<UpdateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    protected readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute(
    command: UpdateOrderCommand,
  ): Promise<UpdateOrderServiceResult> {
    const found = await this.orderRepo.findOneById(command.orderId);

    const order = found.unwrap();
    const updatedResult = order.update({
      status: command.status,
      updatedBy: command.updatedBy,
    });
    if (updatedResult.isErr()) {
      return updatedResult;
    }

    try {
      const updatedOrder = await this.orderRepo.update(order);
      return Ok(updatedOrder);
    } catch (error) {
      if (error instanceof ConflictException) {
        return Err(new OrderAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
