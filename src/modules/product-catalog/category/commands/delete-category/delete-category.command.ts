export class DeleteCategoryCommand {
  readonly categoryId: bigint;

  constructor(props: DeleteCategoryCommand) {
    this.categoryId = props.categoryId;
  }
}
