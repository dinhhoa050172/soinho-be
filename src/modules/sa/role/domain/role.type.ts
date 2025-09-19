export interface RoleProps {
  id?: bigint;
  roleName: string;
  roleDesc?: string | null;
  isActive: boolean;

  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateRoleProps {
  roleName: string;
  roleDesc?: string | null;

  createdBy: string;
}
