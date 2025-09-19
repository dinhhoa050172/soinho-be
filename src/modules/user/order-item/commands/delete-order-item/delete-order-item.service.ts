import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteOrderItemCommand } from './delete-order-item.command';
import { ORDER_ITEM_REPOSITORY } from '../../order-item.di-tokens';
import { OrderItemRepositoryPort } from '../../database/order-item.repository.port';
import { OrderItemEntity } from '../../domain/order-item.entity';
import { OrderItemNotFoundError } from '../../domain/order-item.error';

export type DeleteOrderItemServiceResult = Result<
  boolean,
  OrderItemNotFoundError
>;

@CommandHandler(DeleteOrderItemCommand)
export class DeleteOrderItemService
  implements ICommandHandler<DeleteOrderItemCommand>
{
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY)
    protected readonly orderItemRepo: OrderItemRepositoryPort,
  ) {}

  async execute(
    command: DeleteOrderItemCommand,
  ): Promise<DeleteOrderItemServiceResult> {
    try {
      const result = await this.orderItemRepo.delete({
        id: command.orderItemId,
      } as OrderItemEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new OrderItemNotFoundError(error));
      }

      throw error;
    }
  }
}
