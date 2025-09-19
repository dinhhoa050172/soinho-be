import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTransactionCommand } from './delete-transaction.command';
import { TRANSACTION_REPOSITORY } from '../../transaction.di-tokens';
import { TransactionRepositoryPort } from '../../database/transaction.repository.port';
import { TransactionEntity } from '../../domain/transaction.entity';
import { TransactionNotFoundError } from '../../domain/transaction.error';

export type DeleteTransactionServiceResult = Result<
  boolean,
  TransactionNotFoundError
>;

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionService
  implements ICommandHandler<DeleteTransactionCommand>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    protected readonly transactionRepo: TransactionRepositoryPort,
  ) {}

  async execute(
    command: DeleteTransactionCommand,
  ): Promise<DeleteTransactionServiceResult> {
    try {
      const result = await this.transactionRepo.delete({
        id: command.transactionId,
      } as TransactionEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new TransactionNotFoundError(error));
      }

      throw error;
    }
  }
}
