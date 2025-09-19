import { ExceptionBase } from 'src/libs/exceptions';

export class AddressNotFoundError extends ExceptionBase {
  static readonly message = 'Address not found';

  public readonly code = 'ADDRESS.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(AddressNotFoundError.message, cause, metadata);
  }
}

export class AddressAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Address already exists';

  public readonly code = 'ADDRESS.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(AddressAlreadyExistsError.message, cause, metadata);
  }
}

export class AddressAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Address already in use';

  public readonly code = 'ADDRESS.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(AddressAlreadyInUseError.message, cause, metadata);
  }
}
