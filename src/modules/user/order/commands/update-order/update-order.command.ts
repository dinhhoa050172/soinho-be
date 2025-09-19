import { StatusOrder } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateOrderCommand extends Command {
  readonly orderId: bigint;
  readonly status: StatusOrder;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateOrderCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
