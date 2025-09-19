import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PayosModule } from 'src/libs/payos/payos.module';
import { PaymentMethodMapper } from './mappers/payment-method.mapper';
import { PAYMENT_METHOD_REPOSITORY } from './payment-method.di-tokens';
import { PrismaPaymentMethodRepository } from './database/payment-method.repository.prisma';
import { CreatePaymentMethodService } from './commands/create-payment-method/create-payment-method.service';
import { CreatePaymentMethodHttpController } from './commands/create-payment-method/create-payment-method.http.controller';
import { FindPaymentMethodsHttpController } from './queries/find-payment-methods/find-payment-methods.http.controller';
import { FindPaymentMethodsQueryHandler } from './queries/find-payment-methods/find-payment-methods.query-handler';

const httpControllers = [
  CreatePaymentMethodHttpController,
  FindPaymentMethodsHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [CreatePaymentMethodService];

const queryHandlers: Provider[] = [FindPaymentMethodsQueryHandler];

const mappers: Provider[] = [PaymentMethodMapper];

const repositories: Provider[] = [
  {
    provide: PAYMENT_METHOD_REPOSITORY,
    useClass: PrismaPaymentMethodRepository,
  },
];

@Module({
  imports: [CqrsModule, PayosModule],
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
  exports: [...mappers, ...repositories],
})
export class PaymentMethodModule {}
