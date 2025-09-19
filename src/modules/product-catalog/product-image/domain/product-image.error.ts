import { ExceptionBase } from 'src/libs/exceptions';

export class ProductImageNotFoundError extends ExceptionBase {
  static readonly message = 'ProductImage not found';

  public readonly code = 'PRODUCT_IMAGE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ProductImageNotFoundError.message, cause, metadata);
  }
}

export class ProductImageAlreadyExistsError extends ExceptionBase {
  static readonly message = 'ProductImage already exists';

  public readonly code = 'PRODUCT_IMAGE.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ProductImageAlreadyExistsError.message, cause, metadata);
  }
}

export class ProductImageAlreadyInUseError extends ExceptionBase {
  static readonly message = 'ProductImage already in use';

  public readonly code = 'PRODUCT_IMAGE.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(ProductImageAlreadyInUseError.message, cause, metadata);
  }
}
