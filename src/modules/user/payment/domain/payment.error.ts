import { ExceptionBase } from 'src/libs/exceptions';

export class PaymentNotFoundError extends ExceptionBase {
  static readonly message = 'Payment not found';

  public readonly code = 'PAYMENT.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(PaymentNotFoundError.message, cause, metadata);
  }
}

export class OrderNotFoundError extends ExceptionBase {
  static readonly message = 'Order not found';

  public readonly code = 'PAYMENT.ORDER_NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(OrderNotFoundError.message, cause, metadata);
  }
}

export class PaymentAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Payment already exists';

  public readonly code = 'PAYMENT.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(PaymentAlreadyExistsError.message, cause, metadata);
  }
}

export class PaymentAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Payment already in use';

  public readonly code = 'PAYMENT.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(PaymentAlreadyInUseError.message, cause, metadata);
  }
}
