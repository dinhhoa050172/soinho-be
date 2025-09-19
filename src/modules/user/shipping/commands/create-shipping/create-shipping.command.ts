import { Command, CommandProps } from 'src/libs/ddd';

export class CreateShippingCommand extends Command {
  readonly trackingCode?: string;
  readonly shippedAt?: Date;
  readonly deliveredAt?: Date;
  readonly shippingMethodId: bigint;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateShippingCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
