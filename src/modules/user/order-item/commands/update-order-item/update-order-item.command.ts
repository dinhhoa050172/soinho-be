import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateOrderItemCommand extends Command {
  readonly orderItemId: bigint;
  readonly price?: Prisma.Decimal;
  readonly unitPrice?: Prisma.Decimal;
  readonly quantity?: number;
  readonly orderId?: bigint;
  readonly productId?: bigint;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateOrderItemCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
