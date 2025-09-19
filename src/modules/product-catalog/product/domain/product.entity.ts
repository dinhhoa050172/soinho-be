import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import {
  CreateProductProps,
  ProductProps,
  UpdateProductProps,
} from './product.type';
import { AggregateID, AggregateRoot } from 'src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { ProductAlreadyInUseError } from './product.error';

export class ProductEntity extends AggregateRoot<ProductProps, bigint> {
  // Define more entity methods here
  declare protected readonly _id: AggregateID<bigint>;

  static create(props: CreateProductProps): ProductEntity {
    return new ProductEntity({
      id: BigInt(0),
      props,
    });
  }

  update(props: UpdateProductProps): Result<unknown, ProductAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new ProductAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, ProductAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new ProductAlreadyInUseError());
    }
    return Ok(true);
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
