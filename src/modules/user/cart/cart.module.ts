import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CART_REPOSITORY } from './cart.di-tokens';
import { PrismaCartRepository } from './database/cart.repository.prisma';
import { CartMapper } from './mappers/cart.mapper';
import { AddItemToCartHttpController } from './commands/add-item-to-cart/add-item-to-cart.http.controller';
import { AddItemToCartService } from './commands/add-item-to-cart/add-item-to-cart.service';
import { FindCartByUserIdHttpController } from './queries/find-cart-by-user-id/find-cart-by-user-id.http.controller';
import { FindCartByUserIdQueryHandler } from './queries/find-cart-by-user-id/find-cart-by-user-id.query-handler';
import { RemoveItemFromCartHttpController } from './commands/remove-item-from-cart/remove-item-from-cart.http.controller';
import { RemoveItemFromCartService } from './commands/remove-item-from-cart/remove-item-from-cart.service';
import { ClearCardHttpController } from './commands/clear-cart/clear-cart.http.controller';
import { ClearCartService } from './commands/clear-cart/clear-cart.service';
import { UpdateItemQuantityHttpController } from './commands/update-item-quantity/update-item-quantity.http.controller';
import { UpdateItemQuantityService } from './commands/update-item-quantity/update-item-quantity.service';
import { CreateCartService } from './commands/create-cart/create-cart.service';

const httpControllers = [
  AddItemToCartHttpController,
  UpdateItemQuantityHttpController,
  RemoveItemFromCartHttpController,
  ClearCardHttpController,
  FindCartByUserIdHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  AddItemToCartService,
  UpdateItemQuantityService,
  RemoveItemFromCartService,
  ClearCartService,
  CreateCartService,
];

const queryHandlers: Provider[] = [FindCartByUserIdQueryHandler];

const mappers: Provider[] = [CartMapper];

const repositories: Provider[] = [
  {
    provide: CART_REPOSITORY,
    useClass: PrismaCartRepository,
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
export class CartModule {}
