export class DeleteProductImageCommand {
  readonly productImageId: bigint;

  constructor(props: DeleteProductImageCommand) {
    this.productImageId = props.productImageId;
  }
}
