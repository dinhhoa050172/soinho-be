import { StatusPayment } from '@prisma/client';

export interface PaymentProps {
  id?: bigint;
  amount: number;
  description?: string | null;
  payUrl?: string | null;
  status: StatusPayment;
  paymentMethodId: bigint;
  orderId: bigint;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreatePaymentProps {
  amount: number;
  description?: string | null;
  payUrl?: string | null;
  status: StatusPayment;
  paymentMethodId: bigint;
  orderId: bigint;
  createdBy: string;
}

export interface UpdatePaymentProps {
  amount?: number;
  description?: string | null;
  payUrl?: string | null;
  status?: StatusPayment;
  paymentMethodId?: bigint;
  orderId?: bigint;
  updatedBy: string;
}
