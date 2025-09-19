import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateItemQuantityCommand extends Command {
  readonly cartId: bigint;
  readonly productId: bigint;
  readonly quantity: number;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateItemQuantityCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
