import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProductCustomRepositoryPort } from '../../database/product-custom.repository.port';
import { ProductCustomEntity } from '../../domain/product-custom.entity';
import { ProductCustomAlreadyExistsError } from '../../domain/product-custom.error';
import { PRODUCT_CUSTOM_REPOSITORY } from '../../product-custom.di-token';
import { CreateProductCustomCommand } from './create-product-custom.command';
import { ProductCustomStatus } from '../../domain/product-custom.type';

export type CreateProductCustomServiceResult = Result<ProductCustomEntity, any>;

@CommandHandler(CreateProductCustomCommand)
export class CreateProductCustomService
  implements ICommandHandler<CreateProductCustomCommand>
{
  constructor(
    @Inject(PRODUCT_CUSTOM_REPOSITORY)
    protected readonly productCustomRepo: ProductCustomRepositoryPort,
  ) {}

  async execute(
    command: CreateProductCustomCommand,
  ): Promise<CreateProductCustomServiceResult> {
    const { images, accessory } = command;

    const product = ProductCustomEntity.create({
      ...command.getExtendedProps<CreateProductCustomCommand>([
        'images',
        'accessory',
      ]),
      userId: BigInt(command.userId),
      isActive: true,
      status: ProductCustomStatus.PENDING,
    });
    try {
      const createdProductCustom =
        await this.productCustomRepo.insertProductCustomWithImagesAndAccessory(
          product,
          images || [],
          accessory || [],
        );
      return Ok(createdProductCustom);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ProductCustomAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
