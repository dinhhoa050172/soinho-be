export interface UserProps {
  id?: bigint;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  password: string;
  phone?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  avatarUrl?: string | null;
  roleName: string;

  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateUserProps {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  password: string;
  phone?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  avatarUrl?: string | null;

  roleName: string;

  createdBy: string;
}

export interface UpdateUserProps {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  phone?: string | null;
  isActive?: boolean | null;
  emailVerified?: boolean;
  avatarUrl?: string | null;

  roleName?: string | null;

  updatedBy: string;
}

export interface VerifyEmailUser {
  emailVerified: boolean;
}
