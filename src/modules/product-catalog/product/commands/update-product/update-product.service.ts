import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { ProductRepositoryPort } from '../../database/product.repository.port';
import { ProductEntity } from '../../domain/product.entity';
import {
  ProductAlreadyInUseError,
  ProductNotFoundError,
} from '../../domain/product.error';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';
import { ConflictException } from 'src/libs/exceptions';
import { SlugService } from 'src/libs/slug/slug-generator.service';

export type UpdateProductServiceResult = Result<
  ProductEntity,
  ProductNotFoundError | ProductAlreadyInUseError
>;

@CommandHandler(UpdateProductCommand)
export class UpdateProductService
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    protected readonly productRepo: ProductRepositoryPort,
    private readonly slugGenerator: SlugService,
  ) {}

  async execute(
    command: UpdateProductCommand,
  ): Promise<UpdateProductServiceResult> {
    const { images } = command;
    let slug: string | undefined = undefined;
    if (command.name) {
      slug = await this.slugGenerator.generateUnique(
        command.name,
        async (slug) => {
          return await this.productRepo.existsBySlug(slug);
        },
      );
    }
    const found = await this.productRepo.findOneById(command.productId);
    if (found.isNone()) {
      return Err(new ProductNotFoundError());
    }

    const product = found.unwrap();
    const updatedProduct = product.update({
      ...command.getExtendedProps<UpdateProductCommand>(),
      slug,
    });

    if (updatedProduct.isErr()) {
      return Err(updatedProduct.unwrapErr());
    }

    try {
      const updatedProduct = await this.productRepo.updateProductWithImages(
        product,
        images || undefined,
      );
      return Ok(updatedProduct);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ProductAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
