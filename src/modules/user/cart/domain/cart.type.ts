import { Prisma } from '@prisma/client';

export interface CartProps {
  id?: bigint;
  userId: bigint;
  items: CartItemProps[];

  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateCartProps {
  userId: bigint;
  items: CartItemProps[];
  createdBy: string;
}

export interface UpdateCartProps {
  userId?: bigint;
  updatedBy: string;
}

export interface CartItemProps {
  productId: bigint;
  quantity: number;
  price: Prisma.Decimal;
  productName?: string;
  slug?: string;
  productImageUrl?: string | null;
}
