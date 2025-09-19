import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { PAYMENT_REPOSITORY } from '../../payment.di-tokens';
import { PaymentRepositoryPort } from '../../database/payment.repository.port';
import { PaymentEntity } from '../../domain/payment.entity';
import { PaymentAlreadyExistsError } from '../../domain/payment.error';
import { CreatePaymentCommand } from './create-payment.command';
import {
  FindOrderQuery,
  FindOrderQueryResult,
} from 'src/modules/user/order/queries/find-order/find-order.query-handler';
import { PayosService } from 'src/libs/payos/payos.service';
import { PaymentMethodRepositoryPort } from 'src/modules/user/payment-method/database/payment-method.repository.port';
import { PAYMENT_METHOD_REPOSITORY } from 'src/modules/user/payment-method/payment-method.di-tokens';
import { PaymentMethodNotFoundError } from 'src/modules/user/payment-method/domain/payment-method.error';

export type CreatePaymentServiceResult = Result<
  PaymentEntity,
  PaymentMethodNotFoundError | PaymentAlreadyExistsError
>;

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentService
  implements ICommandHandler<CreatePaymentCommand>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    protected readonly paymentRepo: PaymentRepositoryPort,
    @Inject(PAYMENT_METHOD_REPOSITORY)
    protected readonly paymentMethodRepo: PaymentMethodRepositoryPort,
    private readonly queryBus: QueryBus,
    private readonly payos: PayosService,
  ) {}

  async execute(
    command: CreatePaymentCommand,
  ): Promise<CreatePaymentServiceResult> {
    let url;
    //get payment method
    const paymentMethodFound = await this.paymentMethodRepo.findOneById(
      command.paymentMethodId,
    );
    if (paymentMethodFound.isNone()) {
      return Err(new PaymentMethodNotFoundError());
    }
    const orderFound: FindOrderQueryResult = await this.queryBus.execute(
      new FindOrderQuery(command.orderId),
    );
    if (orderFound.isErr()) {
      throw orderFound.unwrapErr();
    }
    const order = orderFound.unwrap().getProps();
    //get payment method
    if (paymentMethodFound.unwrap().getProps().name.toLowerCase() === 'payos') {
      url = await this.payos.createPaymentLink(
        parseInt(command.orderId.toString()),
        Number(order.totalAmount),
      );
    }
    const payment = PaymentEntity.create({
      amount: Number(order.totalAmount),
      paymentMethodId: command.paymentMethodId,
      orderId: command.orderId,
      status: 'PENDING',
      payUrl: url,
      createdBy: command.createdBy,
    });

    try {
      const createdPayment = await this.paymentRepo.insert(payment);
      return Ok(createdPayment);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new PaymentAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
