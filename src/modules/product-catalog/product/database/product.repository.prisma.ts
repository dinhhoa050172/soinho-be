import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../domain/product.entity';
import { Prisma, ProductImage, Product as ProductModel } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { ProductRepositoryPort } from './product.repository.port';
import { ProductMapper } from '../mappers/product.mapper';
import { Paginated } from 'src/libs/ddd';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConflictException, NotFoundException } from 'src/libs/exceptions';

export const ProductScalarFieldEnum = Prisma.ProductScalarFieldEnum;
@Injectable()
export class PrismaProductRepository
  extends PrismaRepositoryBase<ProductEntity, ProductModel>
  implements ProductRepositoryPort
{
  protected modelName = 'Product';

  constructor(
    private client: PrismaService,
    mapper: ProductMapper,
  ) {
    super(client, mapper);
  }

  async findProductByCategoryMaterialNamePaginated(
    params: PrismaPaginatedQueryBase<Prisma.ProductWhereInput>,
    categoryName?: string,
    materialName?: string,
  ): Promise<Paginated<ProductEntity>> {
    const { limit, offset, page, where = {}, orderBy } = params;

    const combinedWhere: Prisma.ProductWhereInput = {
      ...where,
      ...(categoryName && {
        Category: {
          name: {
            contains: categoryName,
            mode: 'insensitive',
          },
        },
      }),
      ...(materialName && {
        Material: {
          name: {
            contains: materialName,
            mode: 'insensitive',
          },
        },
      }),
    };

    const [data, count] = await Promise.all([
      this.prisma.product.findMany({
        skip: offset,
        take: limit,
        where: combinedWhere,
        orderBy,
        include: {
          Category: true,
          Material: true,
          ProductImage: true,
        },
      }),
      this.prisma.product.count({ where: combinedWhere }),
    ]);

    return new Paginated({
      data: data.map(this.mapper.toDomain),
      count,
      limit,
      page,
    });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    return await this.client.product
      .findFirst({
        where: { slug },
      })
      .then((product) => !!product);
  }

  async updateProductWithImages(
    entity: ProductEntity,
    images?: {
      url: string;
      isThumbnail?: boolean;
    }[],
  ): Promise<ProductEntity> {
    const record = this.mapper.toPersistence(entity);

    try {
      const updatedRecord = await this.client.product.update({
        where: { id: entity.id },
        data: record,
      });

      let updatedRecordImages: ProductImage[] = [];

      if (images && images.length > 0) {
        // Delete all images for the product first
        await this.client.productImage.deleteMany({
          where: { productId: updatedRecord.id },
        });

        // Re-insert all new images
        await this.client.productImage.createMany({
          data: images.map((image) => ({
            productId: updatedRecord.id,
            url: image.url,
            isThumbnail: image.isThumbnail || false,
            createdBy: record.updatedBy ?? record.createdBy,
          })),
        });

        // Fetch newly inserted images to include them in returned domain entity
        updatedRecordImages = await this.client.productImage.findMany({
          where: { productId: updatedRecord.id },
        });
      } else {
        // If no images passed, optionally you could fetch existing ones
        updatedRecordImages = await this.client.productImage.findMany({
          where: { productId: updatedRecord.id },
        });
      }

      const mapped = this.mapper.toDomain({
        ...updatedRecord,
        ProductImage: updatedRecordImages,
      });

      return mapped;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Record not found');
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Record already exists', error);
        }
      }
      throw error;
    }
  }

  async insertProductWithImages(
    entity: ProductEntity,
    images: string[],
  ): Promise<ProductEntity> {
    const record = {
      ...this.mapper.toPersistence(entity),
      id: undefined, // Ensure the ID is not set for creation
    };

    try {
      const createdRecord = await this.client.product.create({
        data: record,
      });
      let createdRecordImages;
      if (images && images.length > 0) {
        createdRecordImages = await Promise.all(
          images.map((image) =>
            this.client.productImage.create({
              data: {
                productId: createdRecord.id,
                url: image,
                isThumbnail: false, // Default value, can be changed later
                createdBy: record.createdBy,
              },
            }),
          ),
        );
      }
      const mapped = this.mapper.toDomain({
        ...createdRecord,
        ProductImage: createdRecordImages,
      });
      // console.log('mapped', mapped);

      return mapped;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Record already exists', error);
      }
      throw error;
    }
  }

  async findProductByParamsPaginated(
    params: PrismaPaginatedQueryBase<Prisma.ProductWhereInput>,
    include?: Prisma.ProductInclude,
  ): Promise<Paginated<ProductEntity>> {
    const { where = {}, orderBy, limit, offset, page } = params;
    const [result, count] = await Promise.all([
      this.client.product.findMany({
        skip: offset,
        take: limit,
        where: { ...where },
        include,
        orderBy,
      }),
      this.client.product.count({
        where: { ...where },
      }),
    ]);
    const data =
      result.length > 0 ? result.map((item) => this.mapper.toDomain(item)) : [];
    return new Paginated({
      data,
      count,
      limit,
      page,
    });
  }
}
