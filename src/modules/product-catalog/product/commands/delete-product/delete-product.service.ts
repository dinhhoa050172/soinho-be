import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';
import { ProductRepositoryPort } from '../../database/product.repository.port';
import { ProductEntity } from '../../domain/product.entity';
import { ProductNotFoundError } from '../../domain/product.error';
import { PRODUCT_REPOSITORY } from '../../product.di-tokens';

export type DeleteProductServiceResult = Result<boolean, ProductNotFoundError>;

@CommandHandler(DeleteProductCommand)
export class DeleteProductService
  implements ICommandHandler<DeleteProductCommand>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    protected readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(
    command: DeleteProductCommand,
  ): Promise<DeleteProductServiceResult> {
    try {
      const result = await this.productRepo.delete({
        id: command.productId,
      } as ProductEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new ProductNotFoundError(error));
      }

      throw error;
    }
  }
}
