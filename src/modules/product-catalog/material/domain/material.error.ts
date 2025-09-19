import { ExceptionBase } from 'src/libs/exceptions';

export class MaterialNotFoundError extends ExceptionBase {
  static readonly message = 'Material not found';

  public readonly code = 'MATERIAL.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(MaterialNotFoundError.message, cause, metadata);
  }
}

export class MaterialAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Material already exists';

  public readonly code = 'MATERIAL.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(MaterialAlreadyExistsError.message, cause, metadata);
  }
}

export class MaterialAlreadyInUseError extends ExceptionBase {
  static readonly message = 'Material already in use';

  public readonly code = 'MATERIAL.ALREADY_IN_USE';

  constructor(cause?: Error, metadata?: unknown) {
    super(MaterialAlreadyInUseError.message, cause, metadata);
  }
}
