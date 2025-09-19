import { AggregateRoot } from 'src/libs/ddd';
import { UserProfileProps } from './user-profile.type';

export class UserProfileEntity extends AggregateRoot<UserProfileProps, bigint> {
  public validate(): void {}
}
