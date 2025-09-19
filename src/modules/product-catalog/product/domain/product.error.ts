import { ExceptionBase } from 'src/libs/exceptions';

export class ProductNotFoundError extends ExceptionBase {
  static readonly message = 'Product not found';

  public readonly code = 'Product.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ProductNotFoundError.message, cause, metadata);
  }
}

export class ProductAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Product already exists';

  public readonly code = 'Product.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ProductAlreadyExistsError.message, cause, metadata);
  }
}

export class ProductAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Product already in use';

  public readonly code = 'Product.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(ProductAlreadyInUseError.message, cause, metadata);
  }
}
