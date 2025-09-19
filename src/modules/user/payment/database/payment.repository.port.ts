import { RepositoryPort } from 'src/libs/ddd';
import { PaymentEntity } from '../domain/payment.entity';
import { Option } from 'oxide.ts';

export interface PaymentRepositoryPort extends RepositoryPort<PaymentEntity> {
  findOrderById(orderId: bigint): Promise<Option<PaymentEntity>>;
}
