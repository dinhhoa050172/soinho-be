import { Command, CommandProps } from 'src/libs/ddd';

export class CreatePaymentCommand extends Command {
  readonly orderId: bigint;
  readonly paymentMethodId: bigint;
  readonly createdBy: string;

  constructor(props: CommandProps<CreatePaymentCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
