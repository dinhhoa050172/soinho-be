import { Prisma } from '.prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class CreateMaterialCommand extends Command {
  readonly name: string;
  readonly unit: string;
  readonly stockQty: number;
  readonly thresholdQty?: number | null;
  readonly price?: Prisma.Decimal | null;
  readonly color?: string | null;
  readonly description?: string | null;
  readonly isActive?: boolean;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateMaterialCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
