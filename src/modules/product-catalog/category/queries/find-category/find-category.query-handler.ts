import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { CATEGORY_REPOSITORY } from '../../category.di-tokens';
import { CategoryRepositoryPort } from '../../database/category.repository.port';
import { CategoryEntity } from '../../domain/category.entity';
import { CategoryNotFoundError } from '../../domain/category.error';

export class FindCategoryQuery {
  categoryId: bigint;

  constructor(public readonly id: bigint) {
    this.categoryId = id;
  }
}

export type FindCategoryQueryResult = Result<
  CategoryEntity,
  CategoryNotFoundError
>;

@QueryHandler(FindCategoryQuery)
export class FindCategoryQueryHandler
  implements IQueryHandler<FindCategoryQuery>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    protected readonly categoryRepo: CategoryRepositoryPort,
  ) {}

  async execute(query: FindCategoryQuery): Promise<FindCategoryQueryResult> {
    const found = await this.categoryRepo.findOneById(query.categoryId);
    if (found.isNone()) return Err(new CategoryNotFoundError());

    return Ok(found.unwrap());
  }
}
