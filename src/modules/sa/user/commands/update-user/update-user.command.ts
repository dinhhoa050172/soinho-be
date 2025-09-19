import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateUserCommand extends Command {
  readonly userId: bigint;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly phone?: string | null;
  readonly password?: string;
  readonly avatarUrl?: string | null;

  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateUserCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
