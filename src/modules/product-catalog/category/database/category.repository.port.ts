import { RepositoryPort } from 'src/libs/ddd';
import { CategoryEntity } from '../domain/category.entity';

export interface CategoryRepositoryPort extends RepositoryPort<CategoryEntity> {
  existsBySlug(slug: string): Promise<boolean>;
}
