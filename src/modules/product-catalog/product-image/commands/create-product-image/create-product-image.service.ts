import { Err, Ok, Result } from 'oxide.ts';

import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductImageCommand } from './create-product-image.command';
import { PRODUCT_IMAGE_REPOSITORY } from '../../product-image.di-tokens';
import { ProductImageRepositoryPort } from '../../database/product-image.repository.port';
import { ProductImageEntity } from '../../domain/product-image.entity';
import { ProductImageAlreadyExistsError } from '../../domain/product-image.error';
import { ConflictException } from 'src/libs/exceptions';

export type CreateProductImageServiceResult = Result<ProductImageEntity, any>;

@CommandHandler(CreateProductImageCommand)
export class CreateProductImageService
  implements ICommandHandler<CreateProductImageCommand>
{
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    protected readonly productRepo: ProductImageRepositoryPort,
  ) {}

  async execute(
    command: CreateProductImageCommand,
  ): Promise<CreateProductImageServiceResult> {
    const product = ProductImageEntity.create({
      ...command.getExtendedProps<CreateProductImageCommand>(),
    });

    try {
      const createdProduct = await this.productRepo.insert(product);
      return Ok(createdProduct);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ProductImageAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
