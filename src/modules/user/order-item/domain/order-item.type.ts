import { Prisma } from '@prisma/client';

export interface OrderItemProps {
  id?: bigint;
  price: Prisma.Decimal;
  unitPrice: Prisma.Decimal;
  quantity: number;
  orderId: bigint;
  productId: bigint;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateOrderItemProps {
  price: Prisma.Decimal;
  unitPrice: Prisma.Decimal;
  quantity: number;
  orderId: bigint;
  productId: bigint;
  createdBy: string;
}

export interface UpdateOrderItemProps {
  price?: Prisma.Decimal;
  unitPrice?: Prisma.Decimal;
  quantity?: number;
  orderId?: bigint;
  productId?: bigint;
  updatedBy: string;
}
