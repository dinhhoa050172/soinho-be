import { AggregateRoot } from 'src/libs/ddd';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Ok, Result } from 'oxide.ts';
import {
  MaterialProps,
  CreateMaterialProps,
  UpdateMaterialProps,
} from './material.type';

export class MaterialEntity extends AggregateRoot<MaterialProps, bigint> {
  static create(props: CreateMaterialProps): MaterialEntity {
    return new MaterialEntity({
      id: BigInt(0),
      props: {
        ...props,
      },
    });
  }

  update(props: UpdateMaterialProps): Result<unknown, any> {
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  public validate(): void {}
}
