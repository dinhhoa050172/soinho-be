import { AggregateRoot } from 'src/libs/ddd';
import { CreateRoleProps, RoleProps } from './role.type';

export class RoleEntity extends AggregateRoot<RoleProps, bigint> {
  static create(props: CreateRoleProps): RoleEntity {
    return new RoleEntity({
      id: BigInt(0),
      props: {
        ...props,
        isActive: true,
      },
    });
  }

  public validate(): void {}
}
