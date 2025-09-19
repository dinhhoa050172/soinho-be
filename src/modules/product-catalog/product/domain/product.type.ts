import { Prisma } from '@prisma/client';
import { ProductImageEntity } from '../../product-image/domain/product-image.entity';
import { CategoryEntity } from '../../category/domain/category.entity';
import { MaterialEntity } from '../../material/domain/material.entity';

export interface ProductProps {
  id?: bigint;
  // Add properties here
  slug: string;
  name: string;
  price?: Prisma.Decimal | null;
  height?: Prisma.Decimal | null;
  width?: Prisma.Decimal | null;
  length?: Prisma.Decimal | null;
  stockQty?: number | null;
  description?: string | null;
  isActive?: boolean;
  categoryId?: bigint | null;
  materialId?: bigint | null;
  createdBy: string;
  updatedBy?: string | null;

  category?: CategoryEntity | null;
  material?: MaterialEntity | null;
  productImages?: ProductImageEntity[];

  inUseCount?: number;
}

export interface CreateProductProps {
  // Add properties here
  slug: string;
  name: string;
  price?: Prisma.Decimal | null;
  height?: Prisma.Decimal | null;
  width?: Prisma.Decimal | null;
  length?: Prisma.Decimal | null;
  stockQty?: number | null;
  description?: string | null;
  isActive?: boolean;
  categoryId?: bigint | null;
  materialId?: bigint | null;
  createdBy: string;
}

export interface UpdateProductProps {
  // Add properties here
  slug?: string | null;
  name?: string | null;
  price?: Prisma.Decimal | null;
  height?: Prisma.Decimal | null;
  width?: Prisma.Decimal | null;
  length?: Prisma.Decimal | null;
  stockQty?: number | null;
  description?: string | null;
  isActive?: boolean;
  categoryId?: bigint | null;
  materialId?: bigint | null;
  updatedBy: string;
}
