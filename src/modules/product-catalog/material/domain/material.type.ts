import { Prisma } from '@prisma/client';

export interface MaterialProps {
  id?: bigint;
  name: string;
  unit: string;
  stockQty: number;
  thresholdQty?: number | null;
  price?: Prisma.Decimal | null;
  color?: string | null;
  description?: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateMaterialProps {
  name: string;
  unit: string;
  stockQty: number;
  thresholdQty?: number | null;
  price?: Prisma.Decimal | null;
  color?: string | null;
  description?: string | null;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateMaterialProps {
  name?: string;
  unit?: string;
  stockQty?: number;
  thresholdQty?: number;
  price?: Prisma.Decimal | null;
  color?: string | null;
  description?: string | null;
  isActive?: boolean;
  updatedBy: string;
}
