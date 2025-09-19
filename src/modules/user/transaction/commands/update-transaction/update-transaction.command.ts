import { StatusTransaction } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateTransactionCommand extends Command {
  readonly orderId: bigint;
  readonly status: StatusTransaction;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateTransactionCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
