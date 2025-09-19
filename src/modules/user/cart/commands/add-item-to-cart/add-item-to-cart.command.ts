import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class AddItemToCartCommand extends Command {
  readonly userId: bigint;
  readonly productId: bigint;
  readonly quantity: number;
  readonly price: Prisma.Decimal;
  readonly createdBy: string;

  constructor(props: CommandProps<AddItemToCartCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
