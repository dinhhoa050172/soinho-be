import { Command, CommandProps } from 'src/libs/ddd';

export class VerifyEmailCommand extends Command {
  readonly token: string;

  constructor(props: CommandProps<VerifyEmailCommand>) {
    super(props);
    this.token = props.token;
  }
}
