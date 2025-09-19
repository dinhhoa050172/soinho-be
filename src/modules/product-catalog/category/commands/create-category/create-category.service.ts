import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CATEGORY_REPOSITORY } from '../../category.di-tokens';
import { CategoryRepositoryPort } from '../../database/category.repository.port';
import { CategoryEntity } from '../../domain/category.entity';
import { CategoryAlreadyExistsError } from '../../domain/category.error';
import { CreateCategoryCommand } from './create-category.command';
import { SlugService } from 'src/libs/slug/slug-generator.service';

export type CreateCategoryServiceResult = Result<CategoryEntity, any>;

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryService
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    protected readonly categoryRepo: CategoryRepositoryPort,
    private readonly slugGenerator: SlugService,
  ) {}

  async execute(
    command: CreateCategoryCommand,
  ): Promise<CreateCategoryServiceResult> {
    const slug = await this.slugGenerator.generateUnique(
      command.name,
      async (slug) => {
        return await this.categoryRepo.existsBySlug(slug);
      },
    );
    const category = CategoryEntity.create({
      ...command.getExtendedProps<CreateCategoryCommand>(),
      isActive: true,
      slug,
    });

    try {
      const createdCategory = await this.categoryRepo.insert(category);
      return Ok(createdCategory);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new CategoryAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
