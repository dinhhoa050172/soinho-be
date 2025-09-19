import { ExceptionBase } from 'src/libs/exceptions';

export class LoginError extends ExceptionBase {
  static readonly message = 'Nhập sai email hoặc mật khẩu';

  public readonly code = 'AUTH.LOGIN_ERROR';

  constructor(cause?: Error, metadata?: unknown) {
    super(LoginError.message, cause, metadata);
  }
}

export class EmailHasBeenRegisteredError extends ExceptionBase {
  static readonly message = 'Email đã được đăng ký';

  public readonly code = 'AUTH.EMAIL_HAS_BEEN_REGISTERED';

  constructor(cause?: Error, metadata?: unknown) {
    super(EmailHasBeenRegisteredError.message, cause, metadata);
  }
}

export class InvalidTokenError extends ExceptionBase {
  static readonly message = 'Token không hợp lệ';

  public readonly code = 'AUTH.INVALID_TOKEN';

  constructor(cause?: Error, metadata?: unknown) {
    super(InvalidTokenError.message, cause, metadata);
  }
}

export class SessionExpiredError extends ExceptionBase {
  static readonly message = 'Session đã hết hạn';

  public readonly code = 'AUTH.SESSION_EXPIRED';

  constructor(cause?: Error, metadata?: unknown) {
    super(SessionExpiredError.message, cause, metadata);
  }
}

export class EmailSendingError extends ExceptionBase {
  static readonly message = 'Email sending error';

  public readonly code = 'AUTH.EMAIL_SENDING_ERROR';

  constructor(cause?: Error, metadata?: unknown) {
    super(EmailSendingError.message, cause, metadata);
  }
}