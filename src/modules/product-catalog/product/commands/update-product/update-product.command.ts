import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateProductCommand extends Command {
  readonly productId: bigint;
  // Add more properties here
  readonly name?: string | null;
  readonly price?: Prisma.Decimal | null;
  readonly height?: Prisma.Decimal | null;
  readonly width?: Prisma.Decimal | null;
  readonly length?: Prisma.Decimal | null;
  readonly stockQty?: number | null;
  readonly description?: string | null;
  readonly isActive?: boolean;
  readonly categoryId?: bigint | null;
  readonly materialId?: bigint | null;
  readonly images?: {
    url: string;
    isThumbnail?: boolean;
  }[];
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateProductCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
