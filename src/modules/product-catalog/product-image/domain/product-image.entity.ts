import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import {
  CreateProductImageProps,
  ProductImageProps,
  UpdateProductImageProps,
} from './product-image.type';
import { AggregateID, AggregateRoot } from 'src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { ProductImageAlreadyInUseError } from './product-image.error';

export class ProductImageEntity extends AggregateRoot<
  ProductImageProps,
  bigint
> {
  // Define more entity methods here
  declare protected readonly _id: AggregateID<bigint>;

  static create(props: CreateProductImageProps): ProductImageEntity {
    return new ProductImageEntity({
      id: BigInt(0),
      props,
    });
  }

  update(
    props: UpdateProductImageProps,
  ): Result<unknown, ProductImageAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new ProductImageAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, ProductImageAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new ProductImageAlreadyInUseError());
    }
    return Ok(true);
    // Entity business rules validation
  }

  validate(): void {
    // Entity business rules validation
  }
}
