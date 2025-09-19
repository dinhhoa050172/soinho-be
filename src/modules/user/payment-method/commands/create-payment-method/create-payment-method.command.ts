import { Command, CommandProps } from 'src/libs/ddd';

export class CreatePaymentMethodCommand extends Command {
  readonly name: string;
  readonly description?: string | null;
  readonly isActive: boolean;
  readonly createdBy: string;

  constructor(props: CommandProps<CreatePaymentMethodCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
