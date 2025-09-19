import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PRODUCT_REPOSITORY } from './product.di-tokens';
import { ProductMapper } from './mappers/product.mapper';
import { PrismaProductRepository } from './database/product.repository.prisma';
import { CreateProductHttpController } from './commands/create-product/create-product.http.controller';
import { CreateProductService } from './commands/create-product/create-product.service';
import { DeleteProductService } from './commands/delete-product/delete-product.service';
import { DeleteProductHttpController } from './commands/delete-product/delete-product.http.controller';
import { UpdateProductService } from './commands/update-product/update-product.service';
import { FindProductsHttpController } from './queries/find-products/find-products.http.controller';
import { FindProductHttpController } from './queries/find-product/find-product.http.controller';
import { FindProductQueryHandler } from './queries/find-product/find-product.query-handler';
import { FindProductsQueryHandler } from './queries/find-products/find-products.query-handler';
import { UpdateProductHttpController } from './commands/update-product/update-product.http.controller';
import { FindProductsWithImagesHttpController } from './queries/find-products-with-images/find-products-with-images.http.controller';
import { FindProductsWithImagesQueryHandler } from './queries/find-products-with-images/find-products-with-images.query-handler';
import { SlugService } from 'src/libs/slug/slug-generator.service';
import { FindProductBySlugHttpController } from './queries/find-product-by-slug/find-product-by-slug.http.controller';
import { FindProductBySlugQueryHandler } from './queries/find-product-by-slug/find-product-by-slug.query-handler';
import { FindProductsByNameHttpController } from './queries/find-products-by-name/find-products-by-name.http.controller';
import { FindProductsByNameQueryHandler } from './queries/find-products-by-name/find-products-by-name.query-handler';

const httpControllers = [
  CreateProductHttpController,
  DeleteProductHttpController,
  UpdateProductHttpController,
  FindProductsHttpController,
  FindProductHttpController,
  FindProductsWithImagesHttpController,
  FindProductBySlugHttpController,
  FindProductsByNameHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateProductService,
  DeleteProductService,
  UpdateProductService,
];

const queryHandlers: Provider[] = [
  FindProductQueryHandler,
  FindProductsQueryHandler,
  FindProductsWithImagesQueryHandler,
  FindProductBySlugQueryHandler,
  FindProductsByNameQueryHandler,
];

const mappers: Provider[] = [ProductMapper];

const utils: Provider[] = [SlugService];

const repositories: Provider[] = [
  {
    provide: PRODUCT_REPOSITORY,
    useClass: PrismaProductRepository,
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
    ...utils,
  ],
  exports: [...repositories],
})
export class ProductModule {}
