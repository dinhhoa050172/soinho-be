import { AggregateRoot } from 'src/libs/ddd';
import { CreateUserProps, UpdateUserProps, UserProps } from './user.type';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Ok, Result } from 'oxide.ts';

export class UserEntity extends AggregateRoot<UserProps, bigint> {
  private static readonly hashService = new HashService();

  static async create(props: CreateUserProps): Promise<UserEntity> {
    const hashedPassword = await this.hashService.hashPassword(props.password);
    return new UserEntity({
      id: BigInt(0),
      props: {
        ...props,
        password: hashedPassword,
      },
    });
  }

  update(props: UpdateUserProps): Result<unknown, any> {
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  public validate(): void {}
}
