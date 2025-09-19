import { Prisma, StatusTransaction } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class CreateTransactionCommand extends Command {
  readonly userId: bigint;
  readonly orderId: bigint;
  readonly productId: bigint;
  readonly quantity: number;
  readonly totalPrice: Prisma.Decimal;
  readonly status: StatusTransaction;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateTransactionCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
