import { Command, CommandProps } from 'src/libs/ddd';

export class UpdateAddressCommand extends Command {
  readonly addressId: bigint;
  readonly userEmail: string;
  readonly fullName?: string;
  readonly phone?: string | null;
  readonly street?: string;
  readonly ward?: string | null;
  readonly district?: string | null;
  readonly province?: string | null;
  readonly country?: string;
  readonly postalCode?: string | null;
  readonly isDefault?: boolean;
  readonly updatedBy: string;

  constructor(props: CommandProps<UpdateAddressCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
