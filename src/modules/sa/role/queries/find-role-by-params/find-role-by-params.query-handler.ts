import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { Result, Err, Ok } from 'oxide.ts';
import { PrismaQueryBase } from 'src/libs/ddd/prisma-query.base';
import { RoleEntity } from '../../domain/role.entity';
import { RoleNotFoundError } from '../../domain/role.error';
import { ROLE_REPOSITORY } from '../../role.di-tokens';
import { RoleRepositoryPort } from '../../database/role.repository.port';

export class FindRoleByParamsQuery extends PrismaQueryBase<Prisma.RoleWhereInput> {}

export type FindRoleByParamsQueryResult = Result<RoleEntity, RoleNotFoundError>;

@QueryHandler(FindRoleByParamsQuery)
export class FindRoleByParamsQueryHandler
  implements IQueryHandler<FindRoleByParamsQuery>
{
  constructor(
    @Inject(ROLE_REPOSITORY)
    protected readonly roleRepo: RoleRepositoryPort,
  ) {}

  async execute(
    query: FindRoleByParamsQuery,
  ): Promise<FindRoleByParamsQueryResult> {
    const found = await this.roleRepo.findRoleByParams(query);
    if (found.isNone()) {
      return Err(new RoleNotFoundError());
    }
    return Ok(found.unwrap());
  }
}
