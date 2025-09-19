import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCategoryCommand } from './delete-category.command';
import { CATEGORY_REPOSITORY } from '../../category.di-tokens';
import { CategoryRepositoryPort } from '../../database/category.repository.port';
import { CategoryEntity } from '../../domain/category.entity';
import { CategoryNotFoundError } from '../../domain/category.error';

export type DeleteCategoryServiceResult = Result<
  boolean,
  CategoryNotFoundError
>;

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryService
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    protected readonly categoryRepo: CategoryRepositoryPort,
  ) {}

  async execute(
    command: DeleteCategoryCommand,
  ): Promise<DeleteCategoryServiceResult> {
    try {
      const result = await this.categoryRepo.delete({
        id: command.categoryId,
      } as CategoryEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new CategoryNotFoundError(error));
      }

      throw error;
    }
  }
}
