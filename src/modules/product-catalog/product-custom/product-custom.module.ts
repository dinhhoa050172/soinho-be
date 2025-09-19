import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductCustomHttpController } from './commands/create-product-custom/create-product-custom.http.controller';
import { CreateProductCustomService } from './commands/create-product-custom/create-product-custom.service';
import { ProductCustomMapper } from './mappers/product-custom.mapper';
import { PRODUCT_CUSTOM_REPOSITORY } from './product-custom.di-token';
import { PrismaProductCustomRepository } from './database/product-custom.repository.prisma';
import { FindProductCustomsByCurrentUserHttpController } from './queries/find-product-customs-by-current-user/find-product-customs-by-current-user.http.controller';
import { FindProductCustomsByCurrentUserQueryHandler } from './queries/find-product-customs-by-current-user/find-product-customs-by-current-user.query-handler';
import { FindProductCustomsQueryHandler } from './queries/find-product-customs/find-product-customs.query-handler';
import { FindProductCustomsHttpController } from './queries/find-product-customs/find-product-customs.http.controller';
import { UpdateProductCustomStatusHttpController } from './commands/update-product-custom-status/update-product-custom-status.http.controller';
import { UpdateProductCustomStatusService } from './commands/update-product-custom-status/update-product-custom-status.service';

const httpControllers = [
  CreateProductCustomHttpController,
  UpdateProductCustomStatusHttpController,
  FindProductCustomsHttpController,
  FindProductCustomsByCurrentUserHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateProductCustomService,
  UpdateProductCustomStatusService,
];

const queryHandlers: Provider[] = [
  FindProductCustomsQueryHandler,
  FindProductCustomsByCurrentUserQueryHandler,
];

const mappers: Provider[] = [ProductCustomMapper];

const repositories: Provider[] = [
  {
    provide: PRODUCT_CUSTOM_REPOSITORY,
    useClass: PrismaProductCustomRepository,
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
  exports: [...repositories],
})
export class ProductCustomModule {}
