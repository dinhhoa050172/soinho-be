import { StatusShipping } from '@prisma/client';

export interface ShippingProps {
  id?: bigint;
  trackingCode?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  status?: StatusShipping;
  shippingMethodId: bigint;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateShippingProps {
  trackingCode?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  status?: StatusShipping;
  shippingMethodId: bigint;
  createdBy: string;
}

export interface UpdateShippingProps {
  trackingCode?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  status?: StatusShipping;
  shippingMethodId?: bigint;
  updatedBy: string;
}
