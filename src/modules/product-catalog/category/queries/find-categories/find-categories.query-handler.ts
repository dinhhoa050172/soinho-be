import { Prisma } from '@prisma/client';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { CategoryEntity } from '../../domain/category.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../category.di-tokens';
import { CategoryRepositoryPort } from '../../database/category.repository.port';

export class FindCategoriesQuery extends PrismaPaginatedQueryBase<Prisma.CategoryWhereInput> {}

export type FindCategoriesQueryResult = Result<Paginated<CategoryEntity>, void>;

@QueryHandler(FindCategoriesQuery)
export class FindCategoriesQueryHandler
  implements IQueryHandler<FindCategoriesQuery>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    protected readonly categoryRepo: CategoryRepositoryPort,
  ) {}

  async execute(
    query: FindCategoriesQuery,
  ): Promise<FindCategoriesQueryResult> {
    const result = await this.categoryRepo.findAllPaginated(query);
    return Ok(
      new Paginated({
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
