export class DeleteTransactionCommand {
  readonly transactionId: bigint;

  constructor(props: DeleteTransactionCommand) {
    this.transactionId = props.transactionId;
  }
}
