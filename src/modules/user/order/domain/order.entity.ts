import { AggregateRoot } from 'src/libs/ddd';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Err, Ok, Result } from 'oxide.ts';
import { OrderProps, CreateOrderProps, UpdateOrderProps } from './order.type';
import { OrderAlreadyInUseError } from './order.error';

export class OrderEntity extends AggregateRoot<OrderProps, bigint> {
  static create(props: CreateOrderProps): OrderEntity {
    return new OrderEntity({
      id: BigInt(0),
      props: {
        ...props,
      },
    });
  }

  update(props: UpdateOrderProps): Result<unknown, OrderAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new OrderAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, OrderAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new OrderAlreadyInUseError());
    }
    return Ok(true);
    // Entity business rules validation
  }

  public validate(): void {}
}
