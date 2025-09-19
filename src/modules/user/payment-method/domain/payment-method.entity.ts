import { AggregateRoot } from 'src/libs/ddd';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Ok, Result } from 'oxide.ts';
import {
  PaymentMethodProps,
  CreatePaymentMethodProps,
  UpdatePaymentMethodProps,
} from './payment-method.type';

export class PaymentMethodEntity extends AggregateRoot<
  PaymentMethodProps,
  bigint
> {
  static create(props: CreatePaymentMethodProps): PaymentMethodEntity {
    return new PaymentMethodEntity({
      id: BigInt(0),
      props,
    });
  }

  update(props: UpdatePaymentMethodProps): Result<unknown, any> {
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  public validate(): void {}
}
