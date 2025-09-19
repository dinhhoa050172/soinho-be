import { Command, CommandProps } from 'src/libs/ddd';

export class CreateProductImageCommand extends Command {
  // Add more properties here
  readonly url: string;
  readonly isThumbnail: boolean;
  readonly productId: bigint;
  readonly productCustomId: bigint | null;
  readonly createdBy: string;

  constructor(props: CommandProps<CreateProductImageCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
