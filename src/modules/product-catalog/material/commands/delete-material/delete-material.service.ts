import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMaterialCommand } from './delete-material.command';
import { MATERIAL_REPOSITORY } from '../../material.di-tokens';
import { MaterialRepositoryPort } from '../../database/material.repository.port';
import { MaterialEntity } from '../../domain/material.entity';
import { MaterialNotFoundError } from '../../domain/material.error';

export type DeleteMaterialServiceResult = Result<
  boolean,
  MaterialNotFoundError
>;

@CommandHandler(DeleteMaterialCommand)
export class DeleteMaterialService
  implements ICommandHandler<DeleteMaterialCommand>
{
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    protected readonly materialRepo: MaterialRepositoryPort,
  ) {}

  async execute(
    command: DeleteMaterialCommand,
  ): Promise<DeleteMaterialServiceResult> {
    try {
      const result = await this.materialRepo.delete({
        id: command.materialId,
      } as MaterialEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new MaterialNotFoundError(error));
      }

      throw error;
    }
  }
}
