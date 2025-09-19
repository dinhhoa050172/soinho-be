import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from 'src/libs/exceptions';
import { TRANSACTION_REPOSITORY } from '../../transaction.di-tokens';
import { TransactionRepositoryPort } from '../../database/transaction.repository.port';
import { TransactionEntity } from '../../domain/transaction.entity';
import {
  TransactionNotFoundError,
  TransactionAlreadyInUseError,
} from '../../domain/transaction.error';
import { UpdateTransactionCommand } from './update-transaction.command';

export type UpdateTransactionServiceResult = Result<
  TransactionEntity[],
  TransactionNotFoundError | TransactionAlreadyInUseError
>;

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionService
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    protected readonly transactionRepo: TransactionRepositoryPort,
  ) {}

  async execute(
    command: UpdateTransactionCommand,
  ): Promise<UpdateTransactionServiceResult> {
    const found = await this.transactionRepo.findByOrderId(command.orderId);
    if (found.length === 0) {
      return Err(new TransactionNotFoundError());
    }
    const updateEntity: TransactionEntity[] = [];
    for (const transaction of found) {
      const updatedTransaction = transaction.update({
        status: command.status,
        updatedBy: command.updatedBy,
      });
      if (updatedTransaction.isErr()) {
        return Err(updatedTransaction.unwrapErr());
      }
      updateEntity.push(transaction);
    }

    try {
      const updatedProduct =
        await this.transactionRepo.updateMany(updateEntity);
      return Ok(updatedProduct);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new TransactionAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
