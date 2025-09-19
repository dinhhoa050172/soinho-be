import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PAYMENT_REPOSITORY } from '../../payment.di-tokens';
import { PaymentRepositoryPort } from '../../database/payment.repository.port';
import { PaymentEntity } from '../../domain/payment.entity';
import {
  PaymentAlreadyExistsError,
  PaymentNotFoundError,
} from '../../domain/payment.error';
import { CancelPaymentCommand } from './cancel-payment.command';
import { PayosService } from 'src/libs/payos/payos.service';
import { StatusPayment } from '@prisma/client';

export type CancelPaymentServiceResult = Result<
  PaymentEntity,
  PaymentNotFoundError | PaymentAlreadyExistsError
>;

@CommandHandler(CancelPaymentCommand)
export class CancelPaymentService
  implements ICommandHandler<CancelPaymentCommand>
{
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    protected readonly paymentRepo: PaymentRepositoryPort,
    private readonly payosService: PayosService,
  ) {}

  async execute(
    command: CancelPaymentCommand,
  ): Promise<CancelPaymentServiceResult> {
    const { orderId, reason, updatedBy } = command;

    // If orderId is not provided, return an error
    const paymentFound = await this.paymentRepo.findOrderById(orderId);
    if (paymentFound.isNone()) {
      return Err(new PaymentNotFoundError());
    }
    try {
      // Cancel payment with PayOS
      await this.payosService.cancel(orderId.toString(), reason);

      // Update payment status in database
      const payment = paymentFound.unwrap();
      payment.update({
        status: StatusPayment.CANCELLED,
        updatedBy,
      });

      const updatedPayment = await this.paymentRepo.update(payment);

      return Ok(updatedPayment);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new PaymentAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
