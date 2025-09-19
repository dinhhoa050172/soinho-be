import { Mapper } from 'src/libs/ddd';
import { Injectable } from '@nestjs/common';
import { Product as ProductModel } from '@prisma/client';
import { ProductImage as ProductImageModel } from '@prisma/client';
import { Category as CategoryModel } from '@prisma/client';
import { Material as MaterialModel } from '@prisma/client';
import { ProductEntity } from '../domain/product.entity';
import { ProductResponseDto } from '../dtos/product.response.dto';
import { ProductImageEntity } from '../../product-image/domain/product-image.entity';
import { ProductImageResponseDto } from '../../product-image/dtos/product-image.response.dto';
import { CategoryEntity } from '../../category/domain/category.entity';
import { MaterialEntity } from '../../material/domain/material.entity';

@Injectable()
export class ProductMapper
  implements Mapper<ProductEntity, ProductModel, ProductResponseDto>
{
  toPersistence(entity: ProductEntity): ProductModel {
    const copy = entity.getProps();
    const record: ProductModel = {
      id: copy.id,
      slug: copy.slug,
      name: copy.name,
      price: copy.price || null,
      height: copy.height || null,
      width: copy.width || null,
      length: copy.length || null,
      stockQty: copy.stockQty ?? null,
      description: copy.description || null,
      isActive: copy.isActive || false,
      categoryId: copy.categoryId || null,
      materialId: copy.materialId || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };
    return record;
  }

  toDomain(
    record: ProductModel & {
      ProductImage?: ProductImageModel[];
      Category?: CategoryModel;
      Material?: MaterialModel;
    },
  ): ProductEntity {
    return new ProductEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        slug: record.slug,
        name: record.name,
        price: record.price || null,
        height: record.height || null,
        width: record.width || null,
        length: record.length || null,
        stockQty: record.stockQty ?? null,
        description: record.description || null,
        isActive: record.isActive || false,
        categoryId: record.categoryId || null,
        materialId: record.materialId || null,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        category: record.Category
          ? new CategoryEntity({
              id: record.Category.id,
              createdAt: record.Category.createdAt,
              updatedAt: record.Category.updatedAt,
              props: {
                slug: record.Category.slug,
                name: record.Category.name,
                desc: record.Category.desc,
                isActive: record.Category.isActive,
                createdBy: record.Category.createdBy,
                updatedBy: record.Category.updatedBy,
              },
            })
          : null,
        material: record.Material
          ? new MaterialEntity({
              id: record.Material.id,
              createdAt: record.Material.createdAt,
              updatedAt: record.Material.updatedAt,
              props: {
                name: record.Material.name,
                description: record.Material.description,
                unit: record.Material.unit,
                stockQty: record.Material.stockQty,
                isActive: record.Material.isActive,
                createdBy: record.Material.createdBy,
                updatedBy: record.Material.updatedBy,
              },
            })
          : null,
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
                      productId: image.productId,
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

  toResponse(entity: ProductEntity): ProductResponseDto {
    const props = entity.getProps();
    const response = new ProductResponseDto(entity);
    // Map entity properties to response DTO
    response.slug = props.slug || null;
    response.name = props.name || null;
    response.price = props.price || null;
    response.height = props.height || null;
    response.width = props.width || null;
    response.length = props.length || null;
    response.stockQty = props.stockQty ?? null;
    response.description = props.description || null;
    response.isActive = props.isActive || false;
    response.categoryName = props.category?.getProps().name || null;
    response.materialName = props.material?.getProps().name || null;
    response.productImages =
      props.productImages && props.productImages.length > 0
        ? props.productImages.map((image) => {
            const responseImage = new ProductImageResponseDto(image);
            responseImage.url = image.getProps().url;
            responseImage.isThumbnail = image.getProps().isThumbnail;
            return responseImage;
          })
        : [];
    return response;
  }
}
