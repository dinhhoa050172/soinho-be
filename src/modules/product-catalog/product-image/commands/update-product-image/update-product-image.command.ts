import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateProductImageCommand extends Command {
  readonly productImageId: bigint;
  // Add more properties here
  readonly url?: string;
  readonly isThumbnail?: boolean;
  readonly productId?: bigint;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateProductImageCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
