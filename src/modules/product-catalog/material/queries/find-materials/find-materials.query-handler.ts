import { Prisma } from '@prisma/client';
import { Ok, Result } from 'oxide.ts';
import { Paginated } from 'src/libs/ddd';
import { PrismaPaginatedQueryBase } from 'src/libs/ddd/prisma-query.base';
import { MaterialEntity } from '../../domain/material.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MATERIAL_REPOSITORY } from '../../material.di-tokens';
import { MaterialRepositoryPort } from '../../database/material.repository.port';

export class FindMaterialsQuery extends PrismaPaginatedQueryBase<Prisma.MaterialWhereInput> {}

export type FindMaterialsQueryResult = Result<Paginated<MaterialEntity>, void>;

@QueryHandler(FindMaterialsQuery)
export class FindMaterialsQueryHandler
  implements IQueryHandler<FindMaterialsQuery>
{
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    protected readonly materialRepo: MaterialRepositoryPort,
  ) {}

  async execute(query: FindMaterialsQuery): Promise<FindMaterialsQueryResult> {
    const result = await this.materialRepo.findAllPaginated(query);
    return Ok(
      new Paginated({
        data: result.data,
        count: result.count,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
