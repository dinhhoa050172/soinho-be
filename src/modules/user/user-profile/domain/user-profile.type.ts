export interface UserProfileProps {
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
