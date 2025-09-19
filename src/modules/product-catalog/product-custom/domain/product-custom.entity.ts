import { AggregateID, AggregateRoot } from 'src/libs/ddd';
import {
  ProductCustomProps,
  CreateProductCustomProps,
  UpdateProductCustomStatusProps,
} from './product-custom.type';
import { Result, Ok } from 'oxide.ts';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';

export class ProductCustomEntity extends AggregateRoot<
  ProductCustomProps,
  bigint
> {
  declare protected readonly _id: AggregateID<bigint>;

  static create(props: CreateProductCustomProps): ProductCustomEntity {
    return new ProductCustomEntity({
      id: BigInt(0),
      props,
    });
  }

  updateStatus(props: UpdateProductCustomStatusProps): Result<unknown, any> {
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  validate(): void {}
}
