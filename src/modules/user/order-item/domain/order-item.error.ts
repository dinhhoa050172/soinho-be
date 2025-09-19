import { ExceptionBase } from 'src/libs/exceptions';

export class OrderItemNotFoundError extends ExceptionBase {
  static readonly message = 'OrderItem not found';

  public readonly code = 'ORDER_ITEM.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(OrderItemNotFoundError.message, cause, metadata);
  }
}

export class OrderItemAlreadyExistsError extends ExceptionBase {
  static readonly message = 'OrderItem already exists';

  public readonly code = 'ORDER_ITEM.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(OrderItemAlreadyExistsError.message, cause, metadata);
  }
}

export class OrderItemAlreadyInUseError extends ExceptionBase {
  static readonly message = 'OrderItem already in use';

  public readonly code = 'ORDER_ITEM.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(OrderItemAlreadyInUseError.message, cause, metadata);
  }
}
