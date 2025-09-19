import { RepositoryPort } from 'src/libs/ddd';
import { PaymentMethodEntity } from '../domain/payment-method.entity';

export type PaymentMethodRepositoryPort = RepositoryPort<PaymentMethodEntity>;
