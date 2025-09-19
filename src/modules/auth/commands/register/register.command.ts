import { Command, CommandProps } from 'src/libs/ddd';

export class RegisterCommand extends Command {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly createdBy: string;

  constructor(props: CommandProps<RegisterCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
