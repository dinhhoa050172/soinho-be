export class RemoveItemFromCartCommand {
  readonly cartId: bigint;
  readonly productId: bigint;

  constructor(props: RemoveItemFromCartCommand) {
    this.productId = props.productId;
    this.cartId = props.cartId;
  }
}
