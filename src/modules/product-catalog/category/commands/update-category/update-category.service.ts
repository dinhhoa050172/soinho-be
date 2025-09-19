import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from 'src/libs/exceptions';
import { CATEGORY_REPOSITORY } from '../../category.di-tokens';
import { CategoryRepositoryPort } from '../../database/category.repository.port';
import { CategoryEntity } from '../../domain/category.entity';
import {
  CategoryNotFoundError,
  CategoryAlreadyInUseError,
} from '../../domain/category.error';
import { UpdateCategoryCommand } from './update-category.command';
import { SlugService } from 'src/libs/slug/slug-generator.service';

export type UpdateCategoryServiceResult = Result<
  CategoryEntity,
  CategoryNotFoundError | CategoryAlreadyInUseError
>;

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryService
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    protected readonly categoryRepo: CategoryRepositoryPort,
    private readonly slugGenerator: SlugService,
  ) {}

  async execute(
    command: UpdateCategoryCommand,
  ): Promise<UpdateCategoryServiceResult> {
    let slug: string | undefined = undefined;
    if (command.name) {
      slug = await this.slugGenerator.generateUnique(
        command.name,
        async (slug) => {
          return await this.categoryRepo.existsBySlug(slug);
        },
      );
    }

    const found = await this.categoryRepo.findOneById(command.categoryId);
    if (found.isNone()) {
      return Err(new CategoryNotFoundError());
    }

    const category = found.unwrap();
    const updatedCategory = category.update({
      ...command.getExtendedProps<UpdateCategoryCommand>(),
      slug,
    });

    if (updatedCategory.isErr()) {
      return Err(updatedCategory.unwrapErr());
    }

    try {
      const updatedProduct = await this.categoryRepo.update(category);
      return Ok(updatedProduct);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new CategoryAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
