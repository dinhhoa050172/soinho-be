import { Injectable } from '@nestjs/common';
import { Prisma, Role as RoleModel } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { None, Option, Some } from 'oxide.ts';
import { PrismaQueryBase } from 'src/libs/ddd/prisma-query.base';
import { RoleEntity } from '../domain/role.entity';
import { RoleRepositoryPort } from './role.repository.port';
import { RoleMapper } from '../mappers/role.mapper';

@Injectable()
export class PrismaRoleRepository
  extends PrismaRepositoryBase<RoleEntity, RoleModel>
  implements RoleRepositoryPort
{
  protected modelName = 'role';

  constructor(
    private client: PrismaService,
    mapper: RoleMapper,
  ) {
    super(client, mapper);
  }

  async findRoleByParams(
    params: PrismaQueryBase<Prisma.RoleWhereInput>,
  ): Promise<Option<RoleEntity>> {
    const { where = {}, orderBy } = params;
    const result = await this.prisma.role.findFirst({
      where: { ...where },
      orderBy,
    });
    return result ? Some(this.mapper.toDomain(result)) : None;
  }
}
