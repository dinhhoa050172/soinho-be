import { AggregateRoot } from 'src/libs/ddd';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Err, Ok, Result } from 'oxide.ts';
import {
  OrderItemProps,
  CreateOrderItemProps,
  UpdateOrderItemProps,
} from './order-item.type';
import { OrderItemAlreadyInUseError } from './order-item.error';

export class OrderItemEntity extends AggregateRoot<OrderItemProps, bigint> {
  static create(props: CreateOrderItemProps): OrderItemEntity {
    return new OrderItemEntity({
      id: BigInt(0),
      props: {
        ...props,
      },
    });
  }

  update(
    props: UpdateOrderItemProps,
  ): Result<unknown, OrderItemAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new OrderItemAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, OrderItemAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new OrderItemAlreadyInUseError());
    }
    return Ok(true);
    // Entity business rules validation
  }

  public validate(): void {}
}
