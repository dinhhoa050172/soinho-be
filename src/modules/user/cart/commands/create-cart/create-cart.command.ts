import { Command, CommandProps } from 'src/libs/ddd';

export class CreateCartCommand extends Command {
  readonly userId: bigint;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateCartCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
