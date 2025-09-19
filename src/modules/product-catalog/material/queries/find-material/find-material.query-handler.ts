import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MATERIAL_REPOSITORY } from '../../material.di-tokens';
import { MaterialRepositoryPort } from '../../database/material.repository.port';
import { MaterialEntity } from '../../domain/material.entity';
import { MaterialNotFoundError } from '../../domain/material.error';

export class FindMaterialQuery {
  materialId: bigint;

  constructor(public readonly id: bigint) {
    this.materialId = id;
  }
}

export type FindMaterialQueryResult = Result<
  MaterialEntity,
  MaterialNotFoundError
>;

@QueryHandler(FindMaterialQuery)
export class FindMaterialQueryHandler
  implements IQueryHandler<FindMaterialQuery>
{
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    protected readonly materialRepo: MaterialRepositoryPort,
  ) {}

  async execute(query: FindMaterialQuery): Promise<FindMaterialQueryResult> {
    const found = await this.materialRepo.findOneById(query.materialId);
    if (found.isNone()) return Err(new MaterialNotFoundError());

    return Ok(found.unwrap());
  }
}
