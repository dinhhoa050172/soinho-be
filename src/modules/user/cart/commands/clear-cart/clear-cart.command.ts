export class ClearCartCommand {
  readonly cartId: bigint;

  constructor(props: ClearCartCommand) {
    this.cartId = props.cartId;
  }
}
