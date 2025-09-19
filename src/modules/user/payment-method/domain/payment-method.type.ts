export interface PaymentMethodProps {
  id?: bigint;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreatePaymentMethodProps {
  name: string;
  description?: string | null;
  isActive: boolean;
  createdBy: string;
}

export interface UpdatePaymentMethodProps {
  name?: string;
  description?: string | null;
  isActive?: boolean;
  updatedBy: string;
}
