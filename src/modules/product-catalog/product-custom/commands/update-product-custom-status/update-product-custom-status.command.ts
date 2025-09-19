import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateProductCustomStatusCommand extends Command {
  readonly productCustomId: bigint;
  readonly status?: string | null;
  readonly price?: Prisma.Decimal | null;
  readonly imageReturn?: string[] | null;
  readonly note?: string | null;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateProductCustomStatusCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
