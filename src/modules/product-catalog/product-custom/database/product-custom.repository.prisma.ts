import { Injectable } from '@nestjs/common';
import { ProductCustom as ProductCustomModel } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConflictException } from 'src/libs/exceptions';
import { ProductCustomEntity } from '../domain/product-custom.entity';
import { ProductCustomMapper } from '../mappers/product-custom.mapper';
import { ProductCustomRepositoryPort } from './product-custom.repository.port';

@Injectable()
export class PrismaProductCustomRepository
  extends PrismaRepositoryBase<ProductCustomEntity, ProductCustomModel>
  implements ProductCustomRepositoryPort
{
  protected modelName = 'productCustom';

  constructor(
    private client: PrismaService,
    mapper: ProductCustomMapper,
  ) {
    super(client, mapper);
  }

  async insertProductCustomWithImagesAndAccessory(
    entity: ProductCustomEntity,
    images: string[],
    accessory: string[],
  ): Promise<ProductCustomEntity> {
    const record = {
      ...this.mapper.toPersistence(entity),
      id: undefined,
      accessory: accessory,
    };

    try {
      const createdRecord = await this.client.productCustom.create({
        data: record,
      });

      let createdRecordImages;
      if (images.length > 0) {
        createdRecordImages = await Promise.all(
          images.map((image) =>
            this.client.productImage.create({
              data: {
                productCustomId: createdRecord.id,
                url: image,
                isThumbnail: false,
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
}
