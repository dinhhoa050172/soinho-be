import { ConflictException, Injectable } from '@nestjs/common';
import { CartMapper } from '../mappers/cart.mapper';
import { Cart as CartModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { None, Option, Some } from 'oxide.ts';
import { CartEntity } from '../domain/cart.entity';
import { CartRepositoryPort } from './cart.repository.port';
import { PrismaQueryBase } from 'src/libs/ddd/prisma-query.base';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const CartScalarFieldEnum = Prisma.CartScalarFieldEnum;

@Injectable()
export class PrismaCartRepository
  extends PrismaRepositoryBase<CartEntity, CartModel>
  implements CartRepositoryPort
{
  protected modelName = 'cart';

  constructor(
    private client: PrismaService,
    mapper: CartMapper,
  ) {
    super(client, mapper);
  }

  async findCartWithItems(userId: bigint): Promise<Option<CartEntity>> {
    const result = await this.client.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                ProductImage: true,
              },
            },
          },
        },
      },
    });
    return result ? Some(this.mapper.toDomain(result)) : None;
  }

  async insertCartWithItem(cart: CartEntity): Promise<CartEntity> {
    const cartData = this.mapper.toPersistence(cart);
    const [firstItem] = cart.getProps().items;

    try {
      let cartRecord = await this.client.cart.findUnique({
        where: { userId: cartData.userId },
        include: { cartItems: true },
      });

      if (!cartRecord) {
        cartRecord = await this.client.cart.create({
          data: {
            userId: cartData.userId,
            createdBy: cartData.createdBy,
          },
          include: { cartItems: true },
        });
      }

      if (firstItem) {
        await this.client.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cartRecord.id,
              productId: firstItem.productId,
            },
          },
          update: {
            quantity: {
              increment: firstItem.quantity,
            },
          },
          create: {
            cartId: cartRecord.id,
            productId: firstItem.productId,
            quantity: firstItem.quantity,
            price: firstItem.price,
            createdBy: cartData.createdBy,
          },
        });
      }

      const updatedCart = await this.client.cart.findUnique({
        where: { id: cartRecord.id },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  ProductImage: true,
                },
              },
            },
          },
        },
      });

      return this.mapper.toDomain(updatedCart);
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

  async insertItemToCart(
    cartId: bigint,
    productId: bigint,
    quantity: number,
    price: Prisma.Decimal,
    createdBy: string,
  ): Promise<CartEntity> {
    await this.client.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId,
        productId,
        quantity,
        price,
        createdBy,
      },
    });

    const cart = await this.client.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: true },
    });

    return this.mapper.toDomain(cart);
  }

  async removeItemFromCart(
    cartId: bigint,
    productId: bigint,
  ): Promise<CartEntity> {
    await this.client.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });

    const updatedCart = await this.client.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: true },
    });

    return this.mapper.toDomain(updatedCart);
  }

  async clearCartItems(cartId: bigint): Promise<void> {
    await this.client.cartItem.deleteMany({
      where: {
        cartId: cartId,
      },
    });
  }

  async updateItemQuantity(
    cartId: bigint,
    productId: bigint,
    quantity: number,
  ): Promise<CartEntity> {
    if (quantity <= 0) {
      await this.client.cartItem.delete({
        where: {
          cartId_productId: { cartId, productId },
        },
      });
    } else {
      await this.client.cartItem.update({
        where: {
          cartId_productId: { cartId, productId },
        },
        data: {
          quantity,
        },
      });
    }

    const updatedCart = await this.client.cart.findUnique({
      where: { id: cartId },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                ProductImage: true,
              },
            },
          },
        },
      },
    });

    return this.mapper.toDomain(updatedCart);
  }

  async findCartByParams(
    params: PrismaQueryBase<Prisma.CartWhereInput>,
  ): Promise<Option<CartEntity>> {
    const { where = {}, orderBy } = params;
    const result = await this.client.cart.findFirst({
      where: { ...where },
      orderBy,
    });
    return result ? Some(this.mapper.toDomain(result)) : None;
  }
}
