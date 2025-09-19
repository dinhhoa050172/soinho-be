import { ExceptionBase } from 'src/libs/exceptions';

export class TransactionNotFoundError extends ExceptionBase {
  static readonly message = 'Transaction not found';

  public readonly code = 'TRANSACTION.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(TransactionNotFoundError.message, cause, metadata);
  }
}

export class TransactionAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Transaction already exists';

  public readonly code = 'TRANSACTION.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(TransactionAlreadyExistsError.message, cause, metadata);
  }
}

export class TransactionAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Transaction already in use';

  public readonly code = 'TRANSACTION.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(TransactionAlreadyInUseError.message, cause, metadata);
  }
}
