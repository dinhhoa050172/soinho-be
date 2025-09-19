import { RepositoryPort } from 'src/libs/ddd';
import { ShippingEntity } from '../domain/shipping.entity';

export type ShippingRepositoryPort = RepositoryPort<ShippingEntity>;
