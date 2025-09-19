import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from 'src/libs/exceptions';
import { ORDER_ITEM_REPOSITORY } from '../../order-item.di-tokens';
import { OrderItemRepositoryPort } from '../../database/order-item.repository.port';
import { OrderItemEntity } from '../../domain/order-item.entity';
import {
  OrderItemNotFoundError,
  OrderItemAlreadyInUseError,
} from '../../domain/order-item.error';
import { UpdateOrderItemCommand } from './update-order-item.command';

export type UpdateOrderItemServiceResult = Result<
  OrderItemEntity,
  OrderItemNotFoundError | OrderItemAlreadyInUseError
>;

@CommandHandler(UpdateOrderItemCommand)
export class UpdateOrderItemService
  implements ICommandHandler<UpdateOrderItemCommand>
{
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY)
    protected readonly orderItemRepo: OrderItemRepositoryPort,
  ) {}

  async execute(
    command: UpdateOrderItemCommand,
  ): Promise<UpdateOrderItemServiceResult> {
    let updatedOldDefaultOrderItem: OrderItemEntity | undefined;
    const found = await this.orderItemRepo.findOneById(command.orderItemId);
    if (found.isNone()) {
      return Err(new OrderItemNotFoundError());
    }

    const orderItem = found.unwrap();
    const updatedOrderItem = orderItem.update({
      ...command.getExtendedProps<UpdateOrderItemCommand>(),
    });

    if (updatedOrderItem.isErr()) {
      return Err(updatedOrderItem.unwrapErr());
    }

    try {
      const updatedProduct = await this.orderItemRepo.update(orderItem);
      if (updatedOldDefaultOrderItem) {
        await this.orderItemRepo.update(updatedOldDefaultOrderItem);
      }
      return Ok(updatedProduct);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new OrderItemAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
