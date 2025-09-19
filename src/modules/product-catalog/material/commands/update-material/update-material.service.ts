import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from 'src/libs/exceptions';
import { MATERIAL_REPOSITORY } from '../../material.di-tokens';
import { MaterialRepositoryPort } from '../../database/material.repository.port';
import { MaterialEntity } from '../../domain/material.entity';
import {
  MaterialNotFoundError,
  MaterialAlreadyInUseError,
} from '../../domain/material.error';
import { UpdateMaterialCommand } from './update-material.command';

export type UpdateMaterialServiceResult = Result<
  MaterialEntity,
  MaterialNotFoundError | MaterialAlreadyInUseError
>;

@CommandHandler(UpdateMaterialCommand)
export class UpdateMaterialService
  implements ICommandHandler<UpdateMaterialCommand>
{
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    protected readonly materialRepo: MaterialRepositoryPort,
  ) {}

  async execute(
    command: UpdateMaterialCommand,
  ): Promise<UpdateMaterialServiceResult> {
    const found = await this.materialRepo.findOneById(command.materialId);
    if (found.isNone()) {
      return Err(new MaterialNotFoundError());
    }

    const material = found.unwrap();
    const updatedMaterial = material.update({
      ...command.getExtendedProps<UpdateMaterialCommand>(),
    });

    if (updatedMaterial.isErr()) {
      return Err(updatedMaterial.unwrapErr());
    }

    try {
      const updatedProduct = await this.materialRepo.update(material);
      return Ok(updatedProduct);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new MaterialAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
