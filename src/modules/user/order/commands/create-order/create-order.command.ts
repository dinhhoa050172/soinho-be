import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class CreateOrderCommand extends Command {
  readonly addressId: bigint;
  readonly totalAmount: Prisma.Decimal;
  readonly paymentMethodId: bigint;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateOrderCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
