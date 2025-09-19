import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TRANSACTION_REPOSITORY } from '../../transaction.di-tokens';
import { TransactionRepositoryPort } from '../../database/transaction.repository.port';
import { TransactionEntity } from '../../domain/transaction.entity';
import { TransactionAlreadyExistsError } from '../../domain/transaction.error';
import { CreateTransactionCommand } from './create-transaction.command';

export type CreateTransactionServiceResult = Result<TransactionEntity, any>;

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionService
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    protected readonly transactionRepo: TransactionRepositoryPort,
  ) {}

  async execute(
    command: CreateTransactionCommand,
  ): Promise<CreateTransactionServiceResult> {
    const transaction = TransactionEntity.create({
      ...command.getExtendedProps<CreateTransactionCommand>(),
    });

    try {
      const createdTransaction = await this.transactionRepo.insert(transaction);
      return Ok(createdTransaction);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new TransactionAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
