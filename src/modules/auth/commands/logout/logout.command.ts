import { Command, CommandProps } from 'src/libs/ddd';

export class LogoutCommand extends Command {
  readonly token: string;

  constructor(props: CommandProps<LogoutCommand>) {
    super(props);
    this.token = props.token;
  }
}
