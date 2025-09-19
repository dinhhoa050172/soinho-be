import { Paginated, RepositoryPort } from 'src/libs/ddd';
import { ProductEntity } from '../domain/product.entity';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export interface ProductRepositoryPort extends RepositoryPort<ProductEntity> {
  existsBySlug(slug: string): Promise<boolean>;
  updateProductWithImages(
    entity: ProductEntity,
    images?: {
      url: string;
      isThumbnail?: boolean;
    }[],
  ): Promise<ProductEntity>;
  insertProductWithImages(
    entity: ProductEntity,
    images: string[],
  ): Promise<ProductEntity>;
  findProductByParamsPaginated(
    params: PrismaPaginatedQueryBase<Prisma.ProductWhereInput>,
    include?: Prisma.ProductInclude,
  ): Promise<Paginated<ProductEntity>>;
  findProductByCategoryMaterialNamePaginated(
    params: PrismaPaginatedQueryBase<Prisma.ProductWhereInput>,
    categoryName?: string,
    materialName?: string,
  ): Promise<Paginated<ProductEntity>>;
}
