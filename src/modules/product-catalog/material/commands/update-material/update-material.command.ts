import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateMaterialCommand extends Command {
  readonly materialId: bigint;
  readonly name?: string;
  readonly unit?: string;
  readonly stockQty?: number;
  readonly thresholdQty?: number;
  readonly price?: Prisma.Decimal | null;
  readonly color?: string | null;
  readonly description?: string | null;
  readonly isActive?: boolean;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateMaterialCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
