import { ExceptionBase } from 'src/libs/exceptions';

export class CartNotFoundError extends ExceptionBase {
  static readonly message = 'Cart not found';

  public readonly code = 'CART.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(CartNotFoundError.message, cause, metadata);
  }
}

export class CartAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Cart already exists';

  public readonly code = 'CART.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(CartAlreadyExistsError.message, cause, metadata);
  }
}

export class CartAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Cart already in use';

  public readonly code = 'CART.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(CartAlreadyInUseError.message, cause, metadata);
  }
}
