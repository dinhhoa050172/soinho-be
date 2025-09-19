import { Mapper } from 'src/libs/ddd';
import { Injectable } from '@nestjs/common';
import { ProductImage as ProductImageModel } from '@prisma/client';
import { ProductImageEntity } from '../domain/product-image.entity';
import { ProductImageResponseDto } from '../dtos/product-image.response.dto';
@Injectable()
export class ProductImageMapper
  implements
    Mapper<ProductImageEntity, ProductImageModel, ProductImageResponseDto>
{
  toPersistence(entity: ProductImageEntity): ProductImageModel {
    const copy = entity.getProps();
    const record: ProductImageModel = {
      id: copy.id,
      // Map entity properties to record
      url: copy.url,
      productId: copy.productId || null,
      productCustomId: copy.productCustomId || null,
      isThumbnail: copy.isThumbnail,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: ProductImageModel): ProductImageEntity {
    return new ProductImageEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        url: record.url,
        productId: record.productId || null,
        productCustomId: record.productCustomId || null,
        isThumbnail: record.isThumbnail,

        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: ProductImageEntity): ProductImageResponseDto {
    const props = entity.getProps();
    const response = new ProductImageResponseDto(entity);
    // Map entity properties to response DTO
    response.url = props.url;
    response.isThumbnail = props.isThumbnail;
    response.productId = props.productId?.toString();
    response.productCustomId = props.productCustomId?.toString();
    return response;
  }
}
