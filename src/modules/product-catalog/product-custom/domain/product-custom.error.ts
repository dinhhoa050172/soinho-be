import { ExceptionBase } from 'src/libs/exceptions';

export class ProductCustomNotFoundError extends ExceptionBase {
  static readonly message = 'Product custom not found';

  public readonly code = 'PRODUCT_CUSTOM.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ProductCustomNotFoundError.message, cause, metadata);
  }
}

export class ProductCustomAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Product custom already exists';

  public readonly code = 'PRODUCT_CUSTOM.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ProductCustomAlreadyExistsError.message, cause, metadata);
  }
}

export class ProductCustomAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Product custom already in use';

  public readonly code = 'PRODUCT_CUSTOM.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(ProductCustomAlreadyInUseError.message, cause, metadata);
  }
}
