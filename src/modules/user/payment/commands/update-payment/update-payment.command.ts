import { StatusPayment } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class UpdatePaymentCommand extends Command {
  readonly paymentId?: bigint;
  readonly orderId?: bigint;
  readonly status: StatusPayment;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdatePaymentCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
