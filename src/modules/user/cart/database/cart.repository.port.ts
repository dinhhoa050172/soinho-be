import { RepositoryPort } from 'src/libs/ddd';
import { CartEntity } from '../domain/cart.entity';
import { Option } from 'oxide.ts';
import { PrismaQueryBase } from 'src/libs/ddd/prisma-query.base';
import { Prisma } from '@prisma/client';

export interface CartRepositoryPort extends RepositoryPort<CartEntity> {
  findCartByParams(
    params: PrismaQueryBase<Prisma.CartWhereInput>,
  ): Promise<Option<CartEntity>>;
  findCartWithItems(userId: bigint): Promise<Option<CartEntity>>;
  insertCartWithItem(cart: CartEntity): Promise<CartEntity>;
  insertItemToCart(
    cartId: bigint,
    productId: bigint,
    quantity: number,
    price: Prisma.Decimal,
    createdBy: string,
  ): Promise<CartEntity>;
  removeItemFromCart(cartId: bigint, productId: bigint): Promise<CartEntity>;
  clearCartItems(cartId: bigint): Promise<void>;
  updateItemQuantity(
    cartId: bigint,
    productId: bigint,
    quantity: number,
  ): Promise<CartEntity>;
}
