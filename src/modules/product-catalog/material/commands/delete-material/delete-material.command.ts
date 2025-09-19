export class DeleteMaterialCommand {
  readonly materialId: bigint;

  constructor(props: DeleteMaterialCommand) {
    this.materialId = props.materialId;
  }
}
