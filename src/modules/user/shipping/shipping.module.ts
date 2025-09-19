import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SHIPPING_REPOSITORY } from './shipping.di-tokens';
import { ShippingMapper } from './mappers/shipping.mapper';
import { PrismaShippingRepository } from './database/shipping.repository.prisma';
import { CreateShippingHttpController } from './commands/create-shipping/create-shipping.http.controller';
import { CreateShippingService } from './commands/create-shipping/create-shipping.service';

const httpControllers = [
  CreateShippingHttpController,
  // UpdateShippingHttpController,
  // DeleteShippingHttpController,
  // FindShippingHttpController,
  // FindShippingsHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateShippingService,
  // UpdateShippingService,
  // DeleteShippingService,
];

const queryHandlers: Provider[] = [
  // FindShippingQueryHandler,
  // FindShippingsQueryHandler,
];

const mappers: Provider[] = [ShippingMapper];

const repositories: Provider[] = [
  {
    provide: SHIPPING_REPOSITORY,
    useClass: PrismaShippingRepository,
  },
];

@Module({
  imports: [CqrsModule],
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
export class ShippingModule {}
