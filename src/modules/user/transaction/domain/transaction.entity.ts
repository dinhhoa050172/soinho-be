import { AggregateRoot } from 'src/libs/ddd';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Err, Ok, Result } from 'oxide.ts';
import {
  TransactionProps,
  CreateTransactionProps,
  UpdateTransactionProps,
} from './transaction.type';
import { TransactionAlreadyInUseError } from './transaction.error';

export class TransactionEntity extends AggregateRoot<TransactionProps, bigint> {
  static create(props: CreateTransactionProps): TransactionEntity {
    return new TransactionEntity({
      id: BigInt(0),
      props: {
        ...props,
      },
    });
  }

  update(
    props: UpdateTransactionProps,
  ): Result<unknown, TransactionAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new TransactionAlreadyInUseError());
    }
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  delete(): Result<unknown, TransactionAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new TransactionAlreadyInUseError());
    }
    return Ok(true);
    // Entity business rules validation
  }

  public validate(): void {}
}
