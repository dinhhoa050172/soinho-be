import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';
import { ProductRepositoryPort } from '../../database/product.repository.port';
import { ProductEntity } from '../../domain/product.entity';
import { ProductAlreadyExistsError } from '../../domain/product.error';
import { SlugService } from 'src/libs/slug/slug-generator.service';

export type CreateProductServiceResult = Result<ProductEntity, any>;

@CommandHandler(CreateProductCommand)
export class CreateProductService
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    protected readonly productRepo: ProductRepositoryPort,
    private readonly slugGenerator: SlugService,
  ) {}

  async execute(
    command: CreateProductCommand,
  ): Promise<CreateProductServiceResult> {
    const { images } = command;
    const slug = await this.slugGenerator.generateUnique(
      command.name,
      async (slug) => {
        return await this.productRepo.existsBySlug(slug);
      },
    );
    const product = ProductEntity.create({
      ...command.getExtendedProps<CreateProductCommand>(['images']),
      slug,
    });

    try {
      const createdProduct = await this.productRepo.insertProductWithImages(
        product,
        images || [],
      );
      return Ok(createdProduct);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ProductAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
