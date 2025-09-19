import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { OrderRepositoryPort } from '../../database/order.repository.port';
import { OrderEntity } from '../../domain/order.entity';
import { OrderAlreadyExistsError } from '../../domain/order.error';
import { ORDER_REPOSITORY } from '../../order.di-tokens';
import { CreateOrderCommand } from './create-order.command';
import { CreatePaymentCommand } from 'src/modules/user/payment/commands/create-payment/create-payment.command';
import { CreatePaymentServiceResult } from 'src/modules/user/payment/commands/create-payment/create-payment.service';
import { PaymentEntity } from 'src/modules/user/payment/domain/payment.entity';
import { CreateShippingServiceResult } from 'src/modules/user/shipping/commands/create-shipping/create-shipping.service';
import { CreateShippingCommand } from 'src/modules/user/shipping/commands/create-shipping/create-shipping.command';
import {
  FindAddressQuery,
  FindAddressQueryResult,
} from 'src/modules/user/address/queries/find-address/find-address.query-handler';
import {
  FindUserByParamsQuery,
  FindUserByParamsQueryResult,
} from 'src/modules/sa/user/queries/find-user-by-params/find-user-by-params.query-handler';

export type CreateOrderServiceResult = Result<
  {
    order: OrderEntity;
    payment: PaymentEntity;
  },
  any
>;

@CommandHandler(CreateOrderCommand)
export class CreateOrderService implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    protected readonly orderRepo: OrderRepositoryPort,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(
    command: CreateOrderCommand,
  ): Promise<CreateOrderServiceResult> {
    const { addressId, createdBy, paymentMethodId, totalAmount } = command;

    //get userId from createdBy email
    const user: FindUserByParamsQueryResult = await this.queryBus.execute(
      new FindUserByParamsQuery({
        where: {
          email: createdBy,
        },
      }),
    );
    if (user.isErr()) {
      return Err(user.unwrapErr());
    }
    const userId = user.unwrap().getProps().id;
    //get address and clone it into order
    const addressFound: FindAddressQueryResult = await this.queryBus.execute(
      new FindAddressQuery(addressId),
    );
    if (addressFound.isErr()) {
      return Err(addressFound.unwrapErr());
    }
    const address = addressFound.unwrap().getProps();

    //tạo shipping trước để lấy shippingId cho order
    const shipping: CreateShippingServiceResult = await this.commandBus.execute(
      new CreateShippingCommand({
        shippingMethodId: BigInt(2), //tạm gắn cứng để kiếm bên shipping
        createdBy,
      }),
    );
    if (shipping.isErr()) {
      return Err(shipping.unwrapErr());
    }
    const order = OrderEntity.create({
      userId,
      shippingFullName: address.fullName,
      shippingPhone: address.phone,
      shippingStreet: address.street,
      shippingWard: address.ward,
      shippingDistrict: address.district,
      shippingProvince: address.province,
      shippingCountry: address.country,
      shippingPostalCode: address.postalCode,
      totalAmount,
      status: 'PENDING',
      shippingId: shipping.unwrap().getProps().id,
      createdBy,
    });

    try {
      const createdOrder = await this.orderRepo.insert(order);

      const payment: CreatePaymentServiceResult = await this.commandBus.execute(
        new CreatePaymentCommand({
          orderId: createdOrder.id,
          paymentMethodId,
          createdBy,
        }),
      );
      return Ok({
        order: createdOrder,
        payment: payment.unwrap(),
      });
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new OrderAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
