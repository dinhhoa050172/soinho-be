import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ORDER_ITEM_REPOSITORY } from './order-item.di-tokens';
import { CreateOrderItemHttpController } from './commands/create-order-item/create-order-item.http.controller';
import { CreateOrderItemService } from './commands/create-order-item/create-order-item.service';
import { DeleteOrderItemHttpController } from './commands/delete-order-item/delete-order-item.http.controller';
import { DeleteOrderItemService } from './commands/delete-order-item/delete-order-item.service';
import { PrismaOrderItemRepository } from './database/order-item.repository.prisma';
import { OrderItemMapper } from './mappers/order-item.mapper';
import { FindOrderItemHttpController } from './queries/find-order-item/find-order-item.http.controller';
import { FindOrderItemQueryHandler } from './queries/find-order-item/find-order-item.query-handler';
import { FindOrderItemsHttpController } from './queries/find-order-items/find-order-items.http.controller';
import { FindOrderItemsQueryHandler } from './queries/find-order-items/find-order-items.query-handler';
import { UpdateOrderItemHttpController } from './commands/update-order-item/update-order-item.http.controller';
import { UpdateOrderItemService } from './commands/update-order-item/update-order-item.service';
import { OrderModule } from '../order/order.module';

const httpControllers = [
  CreateOrderItemHttpController,
  UpdateOrderItemHttpController,
  DeleteOrderItemHttpController,
  FindOrderItemHttpController,
  FindOrderItemsHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateOrderItemService,
  UpdateOrderItemService,
  DeleteOrderItemService,
];

const queryHandlers: Provider[] = [
  FindOrderItemQueryHandler,
  FindOrderItemsQueryHandler,
];

const mappers: Provider[] = [OrderItemMapper];

const repositories: Provider[] = [
  {
    provide: ORDER_ITEM_REPOSITORY,
    useClass: PrismaOrderItemRepository,
  },
];

@Module({
  imports: [CqrsModule, OrderModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class OrderItemModule {}
