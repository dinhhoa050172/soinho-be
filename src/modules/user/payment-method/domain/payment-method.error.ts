import { ExceptionBase } from 'src/libs/exceptions';

export class PaymentMethodNotFoundError extends ExceptionBase {
  static readonly message = 'PaymentMethod not found';

  public readonly code = 'PAYMENT_METHOD.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(PaymentMethodNotFoundError.message, cause, metadata);
  }
}

export class PaymentMethodAlreadyExistsError extends ExceptionBase {
  static readonly message = 'PaymentMethod already exists';

  public readonly code = 'PAYMENT_METHOD.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(PaymentMethodAlreadyExistsError.message, cause, metadata);
  }
}

export class PaymentMethodAlreadyInUseError extends ExceptionBase {
  static readonly message = 'PaymentMethod already in use';

  public readonly code = 'PAYMENT_METHOD.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(PaymentMethodAlreadyInUseError.message, cause, metadata);
  }
}
