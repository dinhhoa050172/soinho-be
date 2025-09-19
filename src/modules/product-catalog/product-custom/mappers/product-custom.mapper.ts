import { Mapper } from 'src/libs/ddd';
import { Injectable } from '@nestjs/common';
import { ProductCustom as ProductCustomModel } from '@prisma/client';
import { ProductImage as ProductImageModel } from '@prisma/client';
import { Material as MaterialModel } from '@prisma/client';
import { ProductImageEntity } from '../../product-image/domain/product-image.entity';
import { ProductImageResponseDto } from '../../product-image/dtos/product-image.response.dto';
import { MaterialEntity } from '../../material/domain/material.entity';
import { ProductCustomEntity } from '../domain/product-custom.entity';
import { ProductCustomResponseDto } from '../dtos/product-custom.response.dto';

@Injectable()
export class ProductCustomMapper
  implements
    Mapper<ProductCustomEntity, ProductCustomModel, ProductCustomResponseDto>
{
  toPersistence(entity: ProductCustomEntity): ProductCustomModel {
    const copy = entity.getProps();
    const record: ProductCustomModel = {
      id: copy.id,
      characterName: copy.characterName,
      characterDesign: copy.characterDesign,
      height: copy.height || null,
      width: copy.width || null,
      length: copy.length || null,
      note: copy.note || null,
      status: copy.status || null,
      price: copy.price || null,
      imageReturn: copy.imageReturn || [],
      accessory: copy.accessory || [],
      isActive: copy.isActive || false,
      userId: copy.userId,

      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };
    return record;
  }

  toDomain(
    record: ProductCustomModel & {
      ProductImage?: ProductImageModel[];
      Material?: MaterialModel[];
    },
  ): ProductCustomEntity {
    return new ProductCustomEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        characterName: record.characterName,
        characterDesign: record.characterDesign,
        height: record.height || null,
        width: record.width || null,
        length: record.length || null,
        note: record.note || null,
        accessory: record.accessory || null,
        status: record.status || null,
        price: record.price || null,
        imageReturn: record.imageReturn || null,
        isActive: record.isActive || false,
        userId: record.userId,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        material:
          record.Material && record.Material.length > 0
            ? record.Material.map(
                (material) =>
                  new MaterialEntity({
                    id: material.id,
                    createdAt: material.createdAt,
                    updatedAt: material.updatedAt,
                    props: {
                      name: material.name,
                      description: material.description,
                      unit: material.unit,
                      stockQty: material.stockQty,
                      isActive: material.isActive,
                      createdBy: material.createdBy,
                      updatedBy: material.updatedBy,
                    },
                  }),
              )
            : [],
        productImages:
          record.ProductImage && record.ProductImage.length > 0
            ? record.ProductImage.map(
                (image) =>
                  new ProductImageEntity({
                    id: image.id,
                    createdAt: image.createdAt,
                    updatedAt: image.updatedAt,
                    props: {
                      url: image.url,
                      productCustomId: image.productCustomId,
                      isThumbnail: image.isThumbnail,
                      createdBy: image.createdBy,
                      updatedBy: image.updatedBy,
                    },
                  }),
              )
            : [],
      },
      skipValidation: true,
    });
  }

  toResponse(entity: ProductCustomEntity): ProductCustomResponseDto {
    const props = entity.getProps();
    const response = new ProductCustomResponseDto(entity);
    response.characterName = props.characterName;
    response.characterDesign = props.characterDesign;
    response.height = props.height || null;
    response.width = props.width || null;
    response.length = props.length || null;
    response.note = props.note || null;
    response.accessory = props.accessory || null;
    response.status = props.status || null;
    response.price = props.price || null;
    response.imageReturn = props.imageReturn || null;
    response.isActive = props.isActive || false;
    response.userId = Number(props.userId);

    // response.materials =
    //   props.material && props.material.length > 0
    //     ? props.material.map((material) => {
    //         const matProps = material.getProps();
    //         const materialResponse = new MaterialResponseDto(material);
    //         materialResponse.name = matProps.name;
    //         materialResponse.description = matProps.description || null;
    //         materialResponse.unit = matProps.unit;
    //         materialResponse.stockQty = matProps.stockQty;
    //         materialResponse.isActive = matProps.isActive;
    //         return materialResponse;
    //       })
    //     : [];

    response.productImages =
      props.productImages && props.productImages.length > 0
        ? props.productImages.map((image) => {
            const imageProps = image.getProps();
            const responseImage = new ProductImageResponseDto(image);
            responseImage.url = imageProps.url;
            responseImage.isThumbnail = imageProps.isThumbnail;
            return responseImage;
          })
        : [];

    return response;
  }
}
