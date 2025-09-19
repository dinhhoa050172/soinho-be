import { ExceptionBase } from 'src/libs/exceptions';

export class UserProfileNotFoundError extends ExceptionBase {
  static readonly message = 'User profile not found';

  public readonly code = 'USER_PROFILE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserProfileNotFoundError.message, cause, metadata);
  }
}
