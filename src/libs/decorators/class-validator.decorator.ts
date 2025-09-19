import {
  Type,
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
  ParseArrayPipe,
} from '@nestjs/common';
import {
  ValidationOptions,
  IsOptional,
  ValidateIf,
  ValidateBy,
  ValidationArguments,
  buildMessage,
  registerDecorator,
} from 'class-validator';

// default IsOptional allows null values, but in some cases you need to allow undefined values only
export function IsOptionalNonNullable(data?: {
  nullable: boolean;
  validationOptions?: ValidationOptions;
}): PropertyDecorator {
  const { nullable = false, validationOptions = undefined } = data || {};

  if (nullable) {
    // IsOptional allows null
    return IsOptional(validationOptions);
  }

  return ValidateIf((ob: any, v: any) => {
    return v !== undefined;
  }, validationOptions);
}

export function IsDateAfter(
  property: string,
  options?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsDateAfter',
      constraints: [property],
      validator: {
        validate: (value: Date, args: ValidationArguments): boolean => {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ] as Date;

          // if the related value is not set, return false
          if (!value || !relatedValue) return false;

          return value.toISOString() > relatedValue.toISOString();
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            `${each}$property must be after $constraint1`,
          options,
        ),
      },
    },
    options,
  );
}

export function IsBigInt(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isBigInt',
      validator: {
        validate: (value): boolean =>
          (typeof value === 'number' || typeof value === 'string') &&
          (/^[0-9]+$/.test(`${value}`) || /^[0-9]+n+$/.test(`${value}`)),
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property must be a BigInt`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}

export const ArrayBody = (dto: Type): ParameterDecorator => {
  return createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    if (!Array.isArray(body)) {
      throw new BadRequestException('The data must be an array.');
    }

    if (!body.length) {
      throw new BadRequestException(
        'The data array must have at least 1 items.',
      );
    }

    const parseArrayPipe = new ParseArrayPipe({
      items: dto,
      whitelist: true,
    });

    return parseArrayPipe.transform(body, { type: 'body' });
  })();
};

export function IsSafeString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSafeString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (Array.isArray(value)) {
            // Xử lý mảng nếu each: true được đặt trong validationOptions
            if (validationOptions?.each) {
              return value.every(
                (item) =>
                  typeof item === 'string' && !/^[^a-zA-Z0-9]/.test(item),
              );
            }
            return false; // Không hỗ trợ mảng nếu each: true không được đặt
          }
          // Xử lý giá trị đơn
          return typeof value === 'string' && !/^[^a-zA-Z0-9]/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not start with special characters`;
        },
      },
    });
  };
}
