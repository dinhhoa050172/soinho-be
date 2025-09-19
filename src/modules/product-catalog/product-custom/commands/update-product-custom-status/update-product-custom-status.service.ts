import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from 'src/libs/exceptions';
import { ProductCustomRepositoryPort } from '../../database/product-custom.repository.port';
import { ProductCustomEntity } from '../../domain/product-custom.entity';
import {
  ProductCustomNotFoundError,
  ProductCustomAlreadyInUseError,
} from '../../domain/product-custom.error';
import { PRODUCT_CUSTOM_REPOSITORY } from '../../product-custom.di-token';
import { UpdateProductCustomStatusCommand } from './update-product-custom-status.command';

export type UpdateProductCustomStatusServiceResult = Result<
  ProductCustomEntity,
  ProductCustomNotFoundError | ProductCustomAlreadyInUseError
>;

@CommandHandler(UpdateProductCustomStatusCommand)
export class UpdateProductCustomStatusService
  implements ICommandHandler<UpdateProductCustomStatusCommand>
{
  constructor(
    @Inject(PRODUCT_CUSTOM_REPOSITORY)
    protected readonly productCustomRepo: ProductCustomRepositoryPort,
  ) {}

  async execute(
    command: UpdateProductCustomStatusCommand,
  ): Promise<UpdateProductCustomStatusServiceResult> {
    const found = await this.productCustomRepo.findOneById(
      command.productCustomId,
    );
    if (found.isNone()) {
      return Err(new ProductCustomNotFoundError());
    }

    const productCustom = found.unwrap();
    const updatedProductCustom = productCustom.updateStatus({
      ...command.getExtendedProps<UpdateProductCustomStatusCommand>(),
    });

    if (updatedProductCustom.isErr()) {
      return Err(updatedProductCustom.unwrapErr());
    }

    try {
      await this.productCustomRepo.update(productCustom);
      // get lại product custom có include product image
      const foundUpdated = await this.productCustomRepo.findOneById(
        productCustom.id,
        { ProductImage: true },
      );
      if (foundUpdated.isNone()) {
        return Err(new ProductCustomNotFoundError());
      }
      return Ok(foundUpdated.unwrap());
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ProductCustomAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
