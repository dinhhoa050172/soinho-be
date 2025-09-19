import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ORDER_REPOSITORY } from './order.di-tokens';
import { FindOrdersHttpController } from './queries/find-orders/find-orders.http.controller';
import { FindOrdersQueryHandler } from './queries/find-orders/find-orders.query-handler';
import { OrderMapper } from './mappers/order.mapper';
import { PrismaOrderRepository } from './database/order.repository.prisma';
import { FindOrderHttpController } from './queries/find-order/find-order.http.controller';
import { FindOrderQueryHandler } from './queries/find-order/find-order.query-handler';
import { CreateOrderHttpController } from './commands/create-order/create-order.http.controller';
import { CreateOrderService } from './commands/create-order/create-order.service';
import { PaymentModule } from '../payment/payment.module';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { FindOrdersByUserHttpController } from './queries/find-orders-by-user/find-orders-by-user.http.controller';
import { FindOrdersByUserQueryHandler } from './queries/find-orders-by-user/find-orders-by-user.query-handler';
import { UpdateOrderService } from './commands/update-order/update-order.service';
import { UpdateOrderHttpController } from './commands/update-order/update-order.http.controller';

const httpControllers = [
  CreateOrderHttpController,
  UpdateOrderHttpController,
  // DeleteOrderHttpController,
  FindOrdersByUserHttpController,
  FindOrderHttpController,
  FindOrdersHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateOrderService,
  UpdateOrderService,
  // DeleteOrderService,
];

const queryHandlers: Provider[] = [
  FindOrdersByUserQueryHandler,
  FindOrderQueryHandler,
  FindOrdersQueryHandler,
];

const mappers: Provider[] = [OrderMapper];

const repositories: Provider[] = [
  {
    provide: ORDER_REPOSITORY,
    useClass: PrismaOrderRepository,
  },
];

@Module({
  imports: [CqrsModule, PaymentModule, PaymentMethodModule],
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
  exports: [...repositories, ...commandHandlers, ...queryHandlers, ...mappers],
})
export class OrderModule {}
