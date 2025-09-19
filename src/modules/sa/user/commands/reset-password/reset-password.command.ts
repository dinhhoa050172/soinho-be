import { Command, CommandProps } from 'src/libs/ddd';

export class ResetPasswordCommand extends Command {
  readonly userEmail: string;
  readonly oldPassword: string;
  readonly newPassword: string;

  constructor(props: CommandProps<ResetPasswordCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
