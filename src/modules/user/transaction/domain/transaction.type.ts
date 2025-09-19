import { Prisma, StatusTransaction } from '@prisma/client';
import { UserEntity } from 'src/modules/sa/user/domain/user.entity';

export interface TransactionProps {
  id?: bigint;
  userId: bigint;
  orderId: bigint;
  productId: bigint;
  quantity: number;
  totalPrice: Prisma.Decimal;
  status: StatusTransaction;

  createdBy: string;
  updatedBy?: string | null;

  user?: UserEntity;
  inUseCount?: number;
}

export interface CreateTransactionProps {
  userId: bigint;
  orderId: bigint;
  productId: bigint;
  quantity: number;
  totalPrice: Prisma.Decimal;
  status: StatusTransaction;
  createdBy: string;
}

export interface UpdateTransactionProps {
  userId?: bigint;
  orderId?: bigint;
  productId?: bigint;
  quantity?: number;
  totalPrice?: Prisma.Decimal;
  status?: StatusTransaction;
  updatedBy: string;
}
