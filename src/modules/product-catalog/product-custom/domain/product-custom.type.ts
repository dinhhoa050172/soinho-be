import { Prisma } from '@prisma/client';
import { ProductImageEntity } from '../../product-image/domain/product-image.entity';
import { MaterialEntity } from '../../material/domain/material.entity';

export enum ProductCustomStatus {
  PENDING = 'PENDING', // Chờ duyệt
  ACCEPTED = 'ACCEPTED', // Đã chấp nhận, chưa bắt đầu
  IN_PROGRESS = 'IN_PROGRESS', // Đang xử lý
  COMPLETED_UNPAID = 'COMPLETED_UNPAID', // Hoàn thành nhưng chưa thanh toán
  COMPLETED_PAID = 'COMPLETED_PAID', // Hoàn thành và đã thanh toán
  REJECTED = 'REJECTED', // Bị từ chối
}

export interface ProductCustomProps {
  id?: bigint;
  characterName: string;
  characterDesign: string;
  height?: Prisma.Decimal | null;
  width?: Prisma.Decimal | null;
  length?: Prisma.Decimal | null;
  note?: string | null;
  accessory?: string[] | null;
  status?: string | null;
  price?: Prisma.Decimal | null;
  imageReturn?: string[] | null;
  isActive?: boolean | null;
  userId: bigint;

  createdBy: string;
  updatedBy?: string | null;
  material?: MaterialEntity[];
  productImages?: ProductImageEntity[];

  inUseCount?: number;
}

export interface CreateProductCustomProps {
  characterName: string;
  characterDesign: string;
  height?: Prisma.Decimal | null;
  width?: Prisma.Decimal | null;
  length?: Prisma.Decimal | null;
  note?: string | null;
  accessory?: string[] | null;
  status?: ProductCustomStatus | null;
  isActive?: boolean | null;
  userId: bigint;
  createdBy: string;
}

export interface UpdateProductCustomStatusProps {
  status?: string | null;
  price?: Prisma.Decimal | null;
  note?: string | null;
  imageReturn?: string[] | null;
  updatedBy: string;
}
