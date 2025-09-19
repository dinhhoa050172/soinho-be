import { ExceptionBase } from 'src/libs/exceptions';

export class ShippingNotFoundError extends ExceptionBase {
  static readonly message = 'Shipping not found';

  public readonly code = 'SHIPPING.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ShippingNotFoundError.message, cause, metadata);
  }
}

export class ShippingAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Shipping already exists';

  public readonly code = 'SHIPPING.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ShippingAlreadyExistsError.message, cause, metadata);
  }
}

export class ShippingAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Shipping already in use';

  public readonly code = 'SHIPPING.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(ShippingAlreadyInUseError.message, cause, metadata);
  }
}
