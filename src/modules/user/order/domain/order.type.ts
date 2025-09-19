import { Prisma, StatusOrder } from '@prisma/client';
import { PaymentEntity } from '../../payment/domain/payment.entity';

export enum PaymentMethod {
  PAYOS = 'PAYOS',
  COD = 'COD',
  CREDIT_CARD = 'CREDIT_CARD',
}
export interface OrderProps {
  id?: bigint;
  totalAmount: Prisma.Decimal;
  status: StatusOrder;
  shippingFullName: string;
  shippingPhone?: string | null;
  shippingStreet: string;
  shippingWard?: string | null;
  shippingDistrict?: string | null;
  shippingProvince?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
  userId: bigint;
  shippingId: bigint;
  createdBy: string;
  updatedBy?: string | null;

  payment?: PaymentEntity;

  inUseCount?: number;
}

export interface CreateOrderProps {
  totalAmount: Prisma.Decimal;
  status: StatusOrder;
  shippingFullName: string;
  shippingPhone?: string | null;
  shippingStreet: string;
  shippingWard?: string | null;
  shippingDistrict?: string | null;
  shippingProvince?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
  userId: bigint;
  shippingId: bigint;
  createdBy: string;
}

export interface UpdateOrderProps {
  totalAmount?: Prisma.Decimal;
  status?: StatusOrder;
  shippingFullName?: string;
  shippingPhone?: string | null;
  shippingStreet?: string;
  shippingWard?: string | null;
  shippingDistrict?: string | null;
  shippingProvince?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
  userId?: bigint;
  shippingId?: bigint;
  updatedBy: string;
}
