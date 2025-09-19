import { RepositoryPort } from 'src/libs/ddd';
import { TransactionEntity } from '../domain/transaction.entity';

export interface TransactionRepositoryPort
  extends RepositoryPort<TransactionEntity> {
  findByOrderId(orderId: bigint): Promise<TransactionEntity[]>;
}
