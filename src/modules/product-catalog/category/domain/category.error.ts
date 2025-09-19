import { ExceptionBase } from 'src/libs/exceptions';

export class CategoryNotFoundError extends ExceptionBase {
  static readonly message = 'Category not found';

  public readonly code = 'CATEGORY.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(CategoryNotFoundError.message, cause, metadata);
  }
}

export class CategoryAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Category already exists';

  public readonly code = 'CATEGORY.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(CategoryAlreadyExistsError.message, cause, metadata);
  }
}

export class CategoryAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Category already in use';

  public readonly code = 'CATEGORY.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(CategoryAlreadyInUseError.message, cause, metadata);
  }
}
