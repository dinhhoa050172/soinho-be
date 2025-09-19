import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class CreateProductCommand extends Command {
  // Add more properties here
  readonly name: string;
  readonly price?: Prisma.Decimal | null;
  readonly height?: Prisma.Decimal | null;
  readonly width?: Prisma.Decimal | null;
  readonly length?: Prisma.Decimal | null;
  readonly stockQty?: number | null;
  readonly description?: string | null;
  readonly isActive?: boolean;
  readonly categoryId?: bigint | null;
  readonly materialId?: bigint | null;
  readonly images?: string[];
  readonly createdBy: string;

  constructor(props: CommandProps<CreateProductCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
