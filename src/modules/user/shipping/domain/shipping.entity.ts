import { AggregateRoot } from 'src/libs/ddd';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Err, Ok, Result } from 'oxide.ts';
import {
  ShippingProps,
  CreateShippingProps,
  UpdateShippingProps,
} from './shipping.type';
import { ShippingAlreadyInUseError } from './shipping.error';

export class ShippingEntity extends AggregateRoot<ShippingProps, bigint> {
  static create(props: CreateShippingProps): ShippingEntity {
    return new ShippingEntity({
      id: BigInt(0),
      props: {
        ...props,
      },
    });
  }

  update(
    props: UpdateShippingProps,
  ): Result<unknown, ShippingAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new ShippingAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, ShippingAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new ShippingAlreadyInUseError());
    }
    return Ok(true);
    // Entity business rules validation
  }

  public validate(): void {}
}
