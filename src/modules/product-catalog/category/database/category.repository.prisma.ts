import { Injectable } from '@nestjs/common';
import { CategoryMapper } from '../mappers/category.mapper';
import { Category as CategoryModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CategoryEntity } from '../domain/category.entity';
import { CategoryRepositoryPort } from './category.repository.port';

export const CategoryScalarFieldEnum = Prisma.CategoryScalarFieldEnum;

@Injectable()
export class PrismaCategoryRepository
  extends PrismaRepositoryBase<CategoryEntity, CategoryModel>
  implements CategoryRepositoryPort
{
  protected modelName = 'category';

  constructor(
    private client: PrismaService,
    mapper: CategoryMapper,
  ) {
    super(client, mapper);
  }

  async existsBySlug(slug: string): Promise<boolean> {
    return await this.client.category
      .findFirst({
        where: { slug },
      })
      .then((category) => !!category);
  }
}
