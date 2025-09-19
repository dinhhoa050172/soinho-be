import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateShippingStatusCommand extends Command {
  readonly ShippingId: bigint;
  readonly price?: Prisma.Decimal;
  readonly unitPrice?: Prisma.Decimal;
  readonly quantity?: number;
  readonly orderId?: bigint;
  readonly productId?: bigint;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateShippingStatusCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
