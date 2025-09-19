import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import {
  CartItem,
  Cart as CartModel,
  Product as ProductModel,
  ProductImage as ProductImageModel,
} from '@prisma/client';
import { CartEntity } from '../domain/cart.entity';
import { CartResponseDto } from '../dtos/cart.response.dto';

@Injectable()
export class CartMapper
  implements Mapper<CartEntity, CartModel, CartResponseDto>
{
  toPersistence(entity: CartEntity): CartModel {
    const copy = entity.getProps();
    const record: CartModel = {
      id: copy.id,
      userId: copy.userId,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(
    record: CartModel & {
      cartItems?: (CartItem & {
        product?: ProductModel & {
          ProductImage?: ProductImageModel[];
        };
      })[];
    },
  ): CartEntity {
    return new CartEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        userId: record.userId,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        items: (record.cartItems || []).map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          slug: item.product?.slug,
          productName: item.product?.name,
          productImageUrl: item.product?.ProductImage?.[0]?.url ?? null,
        })),
      },
      skipValidation: true,
    });
  }

  toResponse(entity: CartEntity): CartResponseDto {
    const props = entity.getProps();
    const response = new CartResponseDto(props);
    response.userId = props.userId.toString();
    response.items = props.items.map((item) => ({
      productId: item.productId.toString(),
      quantity: item.quantity,
      price: item.price,
      slug: item.slug,
      productName: item.productName,
      productImageUrl: item.productImageUrl,
    }));
    return response;
  }
}
