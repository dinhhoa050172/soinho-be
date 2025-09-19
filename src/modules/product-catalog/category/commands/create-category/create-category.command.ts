import { Command, CommandProps } from 'src/libs/ddd';

export class CreateCategoryCommand extends Command {
  readonly name: string;
  readonly desc: string | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateCategoryCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
