import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class CreateOrderItemCommand extends Command {
  readonly price: Prisma.Decimal;
  readonly unitPrice: Prisma.Decimal;
  readonly quantity: number;
  readonly orderId: bigint;
  readonly productId: bigint;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateOrderItemCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
