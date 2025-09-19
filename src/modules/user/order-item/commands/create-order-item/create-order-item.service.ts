import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ORDER_ITEM_REPOSITORY } from '../../order-item.di-tokens';
import { OrderItemRepositoryPort } from '../../database/order-item.repository.port';
import { OrderItemEntity } from '../../domain/order-item.entity';
import { OrderItemAlreadyExistsError } from '../../domain/order-item.error';
import { CreateOrderItemCommand } from './create-order-item.command';
import { CreateTransactionCommand } from 'src/modules/user/transaction/commands/create-transaction/create-transaction.command';
import { ORDER_REPOSITORY } from 'src/modules/user/order/order.di-tokens';
import { OrderRepositoryPort } from 'src/modules/user/order/database/order.repository.port';

export type CreateOrderItemServiceResult = Result<OrderItemEntity, any>;

@CommandHandler(CreateOrderItemCommand)
export class CreateOrderItemService
  implements ICommandHandler<CreateOrderItemCommand>
{
  constructor(
    @Inject(ORDER_ITEM_REPOSITORY)
    protected readonly orderItemRepo: OrderItemRepositoryPort,
    @Inject(ORDER_REPOSITORY)
    protected readonly orderRepo: OrderRepositoryPort,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(
    command: CreateOrderItemCommand,
  ): Promise<CreateOrderItemServiceResult> {
    const orderItem = OrderItemEntity.create({
      ...command.getExtendedProps<CreateOrderItemCommand>(),
    });

    try {
      const createdOrderItem = await this.orderItemRepo.insert(orderItem);

      //get Order
      const order = await this.orderRepo.findOneById(command.orderId);
      if (!order) {
        return Err(new ConflictException('Order not found'));
      }
      const orderProps = order.unwrap().getProps();
      const createdTransaction = await this.commandBus.execute(
        new CreateTransactionCommand({
          orderId: command.orderId,
          userId: orderProps.userId,
          productId: command.productId,
          quantity: command.quantity,
          totalPrice: command.price,
          status: 'PENDING',
          createdBy: command.createdBy,
        }),
      );
      if (createdTransaction.isErr()) {
        return Err(createdTransaction.unwrapErr());
      }
      return Ok(createdOrderItem);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new OrderItemAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
