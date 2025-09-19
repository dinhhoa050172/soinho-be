import { ValueObject } from 'src/libs/ddd';

export interface RequestUserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roleName: string;
}

export class RequestUser extends ValueObject<RequestUserProps> {
  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get phone(): string {
    return this.props.phone;
  }

  get roleName(): string {
    return this.props.roleName;
  }

  protected validate(props: RequestUserProps): void {
    void props;
  }
}
