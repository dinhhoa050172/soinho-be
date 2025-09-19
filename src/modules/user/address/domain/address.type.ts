import { UserEntity } from "src/modules/sa/user/domain/user.entity";

export interface AddressProps {
  id?: bigint;
  userId: bigint;
  fullName: string;
  phone?: string | null;
  street: string;
  ward?: string | null;
  district?: string | null;
  province?: string | null;
  country: string;
  postalCode?: string | null;
  isDefault?: boolean;

  createdBy: string;
  updatedBy?: string | null;

  user?: UserEntity;
  inUseCount?: number;
}

export interface CreateAddressProps {
  userId: bigint;
  fullName: string;
  phone?: string | null;
  street: string;
  ward?: string | null;
  district?: string | null;
  province?: string | null;
  country: string;
  postalCode?: string | null;
  isDefault?: boolean;
  createdBy: string;
}

export interface UpdateAddressProps {
  userId?: bigint;
  fullName?: string;
  phone?: string | null;
  street?: string;
  ward?: string | null;
  district?: string | null;
  province?: string | null;
  country?: string;
  postalCode?: string | null;
  isDefault?: boolean;
  updatedBy: string;
}
