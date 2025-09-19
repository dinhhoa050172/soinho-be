import { Command, CommandProps } from 'src/libs/ddd';

export class CancelPaymentCommand extends Command {
  readonly orderId: bigint;
  readonly reason?: string;
  readonly updatedBy: string;

  constructor(props: CommandProps<CancelPaymentCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
