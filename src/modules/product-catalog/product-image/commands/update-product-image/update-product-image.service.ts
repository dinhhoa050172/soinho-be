import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ProductImageAlreadyInUseError,
  ProductImageNotFoundError,
} from '../../domain/product-image.error';
import { PRODUCT_IMAGE_REPOSITORY } from '../../product-image.di-tokens';
import { ConflictException } from 'src/libs/exceptions';
import { ProductImageRepositoryPort } from '../../database/product-image.repository.port';
import { ProductImageEntity } from '../../domain/product-image.entity';
import { UpdateProductImageCommand } from './update-product-image.command';

export type UpdateProductImageServiceResult = Result<
  ProductImageEntity,
  ProductImageNotFoundError | ProductImageAlreadyInUseError
>;

@CommandHandler(UpdateProductImageCommand)
export class UpdateProductImageService
  implements ICommandHandler<UpdateProductImageCommand>
{
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    protected readonly productRepo: ProductImageRepositoryPort,
  ) {}

  async execute(
    command: UpdateProductImageCommand,
  ): Promise<UpdateProductImageServiceResult> {
    const found = await this.productRepo.findOneById(command.productImageId);
    if (found.isNone()) {
      return Err(new ProductImageNotFoundError());
    }

    const product = found.unwrap();
    const updatedProductImage = product.update({
      ...command.getExtendedProps<UpdateProductImageCommand>(),
    });

    if (updatedProductImage.isErr()) {
      return Err(updatedProductImage.unwrapErr());
    }

    try {
      const updatedProductImage = await this.productRepo.update(product);
      return Ok(updatedProductImage);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ProductImageAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
