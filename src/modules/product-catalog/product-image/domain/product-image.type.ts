export interface ProductImageProps {
  id?: bigint;
  // Add properties here
  url: string;
  isThumbnail: boolean;
  productId?: bigint | null;
  productCustomId?: bigint | null;
  createdBy: string;
  updatedBy?: string | null;

  inUseCount?: number;
}

export interface CreateProductImageProps {
  // Add properties here
  url: string;
  isThumbnail: boolean;
  productCustomId: bigint | null;
  productId: bigint;
  createdBy: string;
}

export interface UpdateProductImageProps {
  // Add properties here
  url?: string;
  isThumbnail?: boolean;
  productCustomId?: bigint | null;
  productId?: bigint;
  updatedBy: string;
}
