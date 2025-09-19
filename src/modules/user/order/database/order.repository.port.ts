import { RepositoryPort } from 'src/libs/ddd';
import { OrderEntity } from '../domain/order.entity';

export type OrderRepositoryPort = RepositoryPort<OrderEntity>;
