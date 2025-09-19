import { Command, CommandProps } from 'src/libs/ddd';

export class ForgotPasswordCommand extends Command {
  readonly email: string;
  readonly token: string;

  constructor(props: CommandProps<ForgotPasswordCommand>) {
    super(props);
    this.email = props.email;
    this.token = props.token;
  }
}
