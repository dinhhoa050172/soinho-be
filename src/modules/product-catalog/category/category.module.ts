import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CATEGORY_REPOSITORY } from './category.di-tokens';
import { PrismaCategoryRepository } from './database/category.repository.prisma';
import { FindCategoriesHttpController } from './queries/find-categories/find-categories.http.controller';
import { FindCategoriesQueryHandler } from './queries/find-categories/find-categories.query-handler';
import { CategoryMapper } from './mappers/category.mapper';
import { CreateCategoryHttpController } from './commands/create-category/create-category.http.controller';
import { CreateCategoryService } from './commands/create-category/create-category.service';
import { UpdateCategoryHttpController } from './commands/update-category/update-category.http.controller';
import { UpdateCategoryService } from './commands/update-category/update-category.service';
import { DeleteCategoryService } from './commands/delete-category/delete-category.service';
import { DeleteCategoryHttpController } from './commands/delete-category/delete-category.http.controller';
import { FindCategoryHttpController } from './queries/find-category/find-category.http.controller';
import { FindCategoryQueryHandler } from './queries/find-category/find-category.query-handler';
import { SlugModule } from 'src/libs/slug/slug.module';

const httpControllers = [
  CreateCategoryHttpController,
  UpdateCategoryHttpController,
  DeleteCategoryHttpController,
  FindCategoryHttpController,
  FindCategoriesHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateCategoryService,
  UpdateCategoryService,
  DeleteCategoryService,
];

const queryHandlers: Provider[] = [
  FindCategoryQueryHandler,
  FindCategoriesQueryHandler,
];

const mappers: Provider[] = [CategoryMapper];

const repositories: Provider[] = [
  {
    provide: CATEGORY_REPOSITORY,
    useClass: PrismaCategoryRepository,
  },
];

@Module({
  imports: [CqrsModule, SlugModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class CategoryModule {}
