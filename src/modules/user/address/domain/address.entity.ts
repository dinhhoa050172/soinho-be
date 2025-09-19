import { AggregateRoot } from 'src/libs/ddd';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Err, Ok, Result } from 'oxide.ts';
import {
  AddressProps,
  CreateAddressProps,
  UpdateAddressProps,
} from './address.type';
import { AddressAlreadyInUseError } from './address.error';

export class AddressEntity extends AggregateRoot<AddressProps, bigint> {
  static create(props: CreateAddressProps): AddressEntity {
    return new AddressEntity({
      id: BigInt(0),
      props: {
        ...props,
      },
    });
  }

  update(props: UpdateAddressProps): Result<unknown, AddressAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new AddressAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, AddressAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new AddressAlreadyInUseError());
    }
    return Ok(true);
    // Entity business rules validation
  }

  public validate(): void {}
}
