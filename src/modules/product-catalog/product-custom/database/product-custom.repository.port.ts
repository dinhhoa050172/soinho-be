import { RepositoryPort } from 'src/libs/ddd';
import { ProductCustomEntity } from '../domain/product-custom.entity';

export interface ProductCustomRepositoryPort
  extends RepositoryPort<ProductCustomEntity> {
  insertProductCustomWithImagesAndAccessory(
    entity: ProductCustomEntity,
    images: string[],
    accessory: string[],
  ): Promise<ProductCustomEntity>;
}
