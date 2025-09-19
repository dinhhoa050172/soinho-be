import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentMethodRepositoryPort } from '../../database/payment-method.repository.port';
import { PaymentMethodEntity } from '../../domain/payment-method.entity';
import { PaymentMethodAlreadyExistsError } from '../../domain/payment-method.error';
import { CreatePaymentMethodCommand } from './create-payment-method.command';
import { PAYMENT_METHOD_REPOSITORY } from '../../payment-method.di-tokens';

export type CreatePaymentMethodServiceResult = Result<PaymentMethodEntity, any>;

@CommandHandler(CreatePaymentMethodCommand)
export class CreatePaymentMethodService
  implements ICommandHandler<CreatePaymentMethodCommand>
{
  constructor(
    @Inject(PAYMENT_METHOD_REPOSITORY)
    protected readonly paymentMethodRepo: PaymentMethodRepositoryPort,
  ) {}

  async execute(
    command: CreatePaymentMethodCommand,
  ): Promise<CreatePaymentMethodServiceResult> {
    const paymentMethod = PaymentMethodEntity.create({
      ...command.getExtendedProps<CreatePaymentMethodCommand>(),
    });

    try {
      const createdPaymentMethod =
        await this.paymentMethodRepo.insert(paymentMethod);

      return Ok(createdPaymentMethod);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new PaymentMethodAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
