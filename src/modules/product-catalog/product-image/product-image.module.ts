import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PRODUCT_IMAGE_REPOSITORY } from './product-image.di-tokens';
import { ProductImageMapper } from './mappers/product-image.mapper';
import { PrismaProductImageRepository } from './database/product-image.repository.prisma';
import { CreateProductImageHttpController } from './commands/create-product-image/create-product-image.http.controller';
import { CreateProductImageService } from './commands/create-product-image/create-product-image.service';
import { DeleteProductImageService } from './commands/delete-product-image/delete-product-image.service';
import { DeleteProductImageHttpController } from './commands/delete-product-image/delete-product-image.http.controller';
import { UpdateProductImageService } from './commands/update-product-image/update-product-image.service';
import { FindProductImagesHttpController } from './queries/find-product-images/find-product-images.http.controller';
import { FindProductImageHttpController } from './queries/find-product-image/find-product-image.http.controller';
import { FindProductImageQueryHandler } from './queries/find-product-image/find-product-image.query-handler';
import { FindProductImagesQueryHandler } from './queries/find-product-images/find-product-images.query-handler';
import { UpdateProductImageHttpController } from './commands/update-product-image/update-product-image.http.controller';

const httpControllers = [
  CreateProductImageHttpController,
  DeleteProductImageHttpController,
  UpdateProductImageHttpController,
  FindProductImagesHttpController,
  FindProductImageHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateProductImageService,
  DeleteProductImageService,
  UpdateProductImageService,
];

const queryHandlers: Provider[] = [
  FindProductImageQueryHandler,
  FindProductImagesQueryHandler,
];

const mappers: Provider[] = [ProductImageMapper];

const repositories: Provider[] = [
  {
    provide: PRODUCT_IMAGE_REPOSITORY,
    useClass: PrismaProductImageRepository,
  },
];

@Module({
  imports: [CqrsModule],
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
  exports: [...repositories, ...mappers, ...commandHandlers, ...queryHandlers],
})
export class ProductImageModule {}
