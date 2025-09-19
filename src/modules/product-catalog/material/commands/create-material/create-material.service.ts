import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MATERIAL_REPOSITORY } from '../../material.di-tokens';
import { MaterialRepositoryPort } from '../../database/material.repository.port';
import { MaterialEntity } from '../../domain/material.entity';
import { MaterialAlreadyExistsError } from '../../domain/material.error';
import { CreateMaterialCommand } from './create-material.command';

export type CreateMaterialServiceResult = Result<MaterialEntity, any>;

@CommandHandler(CreateMaterialCommand)
export class CreateMaterialService
  implements ICommandHandler<CreateMaterialCommand>
{
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    protected readonly materialRepo: MaterialRepositoryPort,
  ) {}

  async execute(
    command: CreateMaterialCommand,
  ): Promise<CreateMaterialServiceResult> {
    const material = MaterialEntity.create({
      ...command.getExtendedProps<CreateMaterialCommand>(),
      isActive: true,
    });

    try {
      const createdMaterial = await this.materialRepo.insert(material);
      return Ok(createdMaterial);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new MaterialAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
