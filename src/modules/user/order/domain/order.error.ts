import { ExceptionBase } from 'src/libs/exceptions';

export class OrderNotFoundError extends ExceptionBase {
  static readonly message = 'Order not found';

  public readonly code = 'ORDER.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(OrderNotFoundError.message, cause, metadata);
  }
}

export class OrderAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Order already exists';

  public readonly code = 'ORDER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(OrderAlreadyExistsError.message, cause, metadata);
  }
}

export class OrderAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Order already in use';

  public readonly code = 'ORDER.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(OrderAlreadyInUseError.message, cause, metadata);
  }
}
