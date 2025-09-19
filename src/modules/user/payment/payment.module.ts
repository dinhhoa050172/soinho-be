import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PayosModule } from 'src/libs/payos/payos.module';
import { CreatePaymentHttpController } from './commands/create-payment/create-payment.http.controller';
import { CreatePaymentService } from './commands/create-payment/create-payment.service';
import { PrismaPaymentRepository } from './database/payment.repository.prisma';
import { PaymentMapper } from './mappers/payment.mapper';
import { PAYMENT_REPOSITORY } from './payment.di-tokens';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { UpdatePaymentService } from './commands/update-payment/update-payment.service';
import { PayOSController } from './commands/webhook.controller';
import { FindPaymentsByOrderHttpController } from './queries/find-payments-by-order/find-payments-by-order.http.controller';
import { FindPaymentsByOrderQueryHandler } from './queries/find-payments-by-order/find-payments-by-order.query-handler';
import { FindPaymentHttpController } from './queries/find-payment/find-payment.http.controller';
import { FindPaymentQueryHandler } from './queries/find-payment/find-payment.query-handler';
import { CancelPaymentHttpController } from './commands/cancel-payment/cancel-payment.http.controller';
import { CancelPaymentService } from './commands/cancel-payment/cancel-payment.service';
import { UpdatePaymentHttpController } from './commands/update-payment/update-payment.http.controller';

const httpControllers = [
  CreatePaymentHttpController,
  PayOSController,
  FindPaymentsByOrderHttpController,
  FindPaymentHttpController,
  CancelPaymentHttpController,
  UpdatePaymentHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CancelPaymentService,
  CreatePaymentService,
  UpdatePaymentService,
];

const queryHandlers: Provider[] = [
  FindPaymentsByOrderQueryHandler,
  FindPaymentQueryHandler,
];

const mappers: Provider[] = [PaymentMapper];

const repositories: Provider[] = [
  {
    provide: PAYMENT_REPOSITORY,
    useClass: PrismaPaymentRepository,
  },
];

@Module({
  imports: [CqrsModule, PayosModule, PaymentMethodModule],
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
  exports: [...mappers],
})
export class PaymentModule {}
