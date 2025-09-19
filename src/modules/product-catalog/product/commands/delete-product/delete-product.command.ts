export class DeleteProductCommand {
  readonly productId: bigint;

  constructor(props: DeleteProductCommand) {
    this.productId = props.productId;
  }
}
