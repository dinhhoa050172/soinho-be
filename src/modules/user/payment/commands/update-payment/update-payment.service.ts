import { Err, Ok, Option, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PAYMENT_REPOSITORY } from '../../payment.di-tokens';
import { PaymentRepositoryPort } from '../../database/payment.repository.port';
import { PaymentEntity } from '../../domain/payment.entity';
import {
  PaymentAlreadyExistsError,
  PaymentNotFoundError,
} from '../../domain/payment.error';
import { UpdatePaymentCommand } from './update-payment.command';

export type UpdatePaymentServiceResult = Result<
  PaymentEntity,
  PaymentNotFoundError | PaymentAlreadyExistsError
>;

@CommandHandler(UpdatePaymentCommand)
export class UpdatePaymentService
  implements ICommandHandler<UpdatePaymentCommand>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    protected readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  async execute(
    command: UpdatePaymentCommand,
  ): Promise<UpdatePaymentServiceResult> {
    const { paymentId, orderId } = command;
    if (!paymentId && !orderId) {
      throw new Error('Either paymentId or orderId must be provided');
    }
    if (paymentId && orderId) {
      throw new Error('Only one of paymentId or orderId should be provided');
    }
    // If paymentId is provided, find by paymentId
    let paymentFound: Option<PaymentEntity> | undefined;
    if (orderId) {
      paymentFound = await this.paymentRepo.findOrderById(orderId);
    }
    // If orderId is provided, find by orderId
    else if (paymentId) {
      paymentFound = await this.paymentRepo.findOneById(paymentId);
    }
    // If no payment is found, return an error
    if (paymentFound === undefined || paymentFound.isNone()) {
      return Err(new PaymentNotFoundError());
    }
    const payment = paymentFound.unwrap();
    payment.update({
      status: command.status,
      updatedBy: command.updatedBy,
    });

    try {
      const createdPayment = await this.paymentRepo.update(payment);
      return Ok(createdPayment);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new PaymentAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
