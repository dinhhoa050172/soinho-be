import { AggregateRoot } from 'src/libs/ddd';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Ok, Result } from 'oxide.ts';
import {
  PaymentProps,
  CreatePaymentProps,
  UpdatePaymentProps,
} from './payment.type';

export class PaymentEntity extends AggregateRoot<PaymentProps, bigint> {
  static create(props: CreatePaymentProps): PaymentEntity {
    return new PaymentEntity({
      id: BigInt(0),
      props,
    });
  }

  update(props: UpdatePaymentProps): Result<unknown, any> {
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  public validate(): void {}
}
