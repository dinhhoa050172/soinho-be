import { RepositoryPort } from 'src/libs/ddd';
import { OrderItemEntity } from '../domain/order-item.entity';

export type OrderItemRepositoryPort = RepositoryPort<OrderItemEntity>;
