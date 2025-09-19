import { RepositoryPort } from 'src/libs/ddd';
import { ProductImageEntity } from '../domain/product-image.entity';

export type ProductImageRepositoryPort = RepositoryPort<ProductImageEntity>;
