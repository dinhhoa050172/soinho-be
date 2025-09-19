export class DeleteOrderItemCommand {
  readonly orderItemId: bigint;

  constructor(props: DeleteOrderItemCommand) {
    this.orderItemId = props.orderItemId;
  }
}
