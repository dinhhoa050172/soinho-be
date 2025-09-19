import { Injectable } from '@nestjs/common';
import { ProductImageEntity } from '../domain/product-image.entity';
import { Prisma, ProductImage as ProductImageModel } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { ProductImageRepositoryPort } from './product-image.repository.port';
import { ProductImageMapper } from '../mappers/product-image.mapper';

export const ProductImageScalarFieldEnum = Prisma.ProductImageScalarFieldEnum;
@Injectable()
export class PrismaProductImageRepository
  extends PrismaRepositoryBase<ProductImageEntity, ProductImageModel>
  implements ProductImageRepositoryPort
{
  protected modelName = 'productImage';

  constructor(
    private client: PrismaService,
    mapper: ProductImageMapper,
  ) {
    super(client, mapper);
  }
}
