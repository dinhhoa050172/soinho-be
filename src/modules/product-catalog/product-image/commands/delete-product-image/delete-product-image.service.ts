import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProductImageRepositoryPort } from '../../database/product-image.repository.port';
import { ProductImageEntity } from '../../domain/product-image.entity';
import { PRODUCT_IMAGE_REPOSITORY } from '../../product-image.di-tokens';
import { ProductImageNotFoundError } from '../../domain/product-image.error';
import { DeleteProductImageCommand } from './delete-product-image.command';

export type DeleteProductImageServiceResult = Result<
  boolean,
  ProductImageNotFoundError
>;

@CommandHandler(DeleteProductImageCommand)
export class DeleteProductImageService
  implements ICommandHandler<DeleteProductImageCommand>
{
  constructor(
    @Inject(PRODUCT_IMAGE_REPOSITORY)
    protected readonly productRepo: ProductImageRepositoryPort,
  ) {}

  async execute(
    command: DeleteProductImageCommand,
  ): Promise<DeleteProductImageServiceResult> {
    try {
      const result = await this.productRepo.delete({
        id: command.productImageId,
      } as ProductImageEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new ProductImageNotFoundError(error));
      }

      throw error;
    }
  }
}
