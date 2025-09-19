export class DeleteAddressCommand {
  readonly addressId: bigint;

  constructor(props: DeleteAddressCommand) {
    this.addressId = props.addressId;
  }
}
