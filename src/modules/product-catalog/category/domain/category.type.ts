export interface CategoryProps {
  id?: bigint;
  slug: string;
  name: string;
  desc?: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateCategoryProps {
  slug: string;
  name: string;
  desc?: string | null;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateCategoryProps {
  slug?: string;
  name?: string;
  desc?: string | null;
  isActive?: boolean;
  updatedBy: string;
}
