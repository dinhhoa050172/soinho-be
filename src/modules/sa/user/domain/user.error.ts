import { ExceptionBase } from 'src/libs/exceptions';

export class UserNotFoundError extends ExceptionBase {
  static readonly message = 'User not found';

  public readonly code = 'USER.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserNotFoundError.message, cause, metadata);
  }
}

export class UserAlreadyExistsError extends ExceptionBase {
  static readonly message = 'User already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserAlreadyExistsError.message, cause, metadata);
  }
}

export class UserAlreadyInUseError extends ExceptionBase {
  static readonly message = 'User already in use';

  public readonly code = 'USER.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserAlreadyInUseError.message, cause, metadata);
  }
}

export class InvalidPasswordError extends ExceptionBase {
  static readonly message = 'Invalid password';

  public readonly code = 'USER.INVALID_PASSWORD';

  constructor(cause?: Error, metadata?: unknown) {
    super(InvalidPasswordError.message, cause, metadata);
  }
}

export class WrongOldPasswordError extends ExceptionBase {
  static readonly message = 'Mật khẩu cũ không đúng';

  public readonly code = 'USER.WRONG_OLD_PASSWORD';

  constructor(cause?: Error, metadata?: unknown) {
    super(WrongOldPasswordError.message, cause, metadata);
  }
}
