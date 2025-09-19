import { Command, CommandProps } from 'src/libs/ddd';

export class CreateRoleCommand extends Command {
  readonly roleName: string;
  readonly roleDesc?: string;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateRoleCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
