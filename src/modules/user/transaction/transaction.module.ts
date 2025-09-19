import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TRANSACTION_REPOSITORY } from './transaction.di-tokens';
import { CreateTransactionService } from './commands/create-transaction/create-transaction.service';
import { DeleteTransactionService } from './commands/delete-transaction/delete-transaction.service';
import { PrismaTransactionRepository } from './database/transaction.repository.prisma';
import { TransactionMapper } from './mappers/transaction.mapper';
import { FindTransactionsHttpController } from './queries/find-transactions/find-transactions.http.controller';
import { FindTransactionsQueryHandler } from './queries/find-transactions/find-transactions.query-handler';
import { FindTransactionByUserHttpController } from './queries/find-transaction-by-user/find-transaction-by-user.http.controller';
import { FindTransactionByUserQueryHandler } from './queries/find-transaction-by-user/find-transaction-by-user.query-handler';
import { UpdateTransactionService } from './commands/update-transaction/update-transaction.service';

const httpControllers = [
  FindTransactionByUserHttpController,
  FindTransactionsHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateTransactionService,
  UpdateTransactionService,
  DeleteTransactionService,
];

const queryHandlers: Provider[] = [
  FindTransactionByUserQueryHandler,
  FindTransactionsQueryHandler,
];

const mappers: Provider[] = [TransactionMapper];

const repositories: Provider[] = [
  {
    provide: TRANSACTION_REPOSITORY,
    useClass: PrismaTransactionRepository,
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
export class TransactionModule {}
