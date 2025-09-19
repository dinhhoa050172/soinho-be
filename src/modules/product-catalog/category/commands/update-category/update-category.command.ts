import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateCategoryCommand extends Command {
  readonly categoryId: bigint;
  readonly name?: string;
  readonly desc?: string | null;
  readonly isActive?: boolean;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateCategoryCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
