import { RepositoryPort } from 'src/libs/ddd';
import { RoleEntity } from '../domain/role.entity';
import { Prisma } from '@prisma/client';
import { PrismaQueryBase } from 'src/libs/ddd/prisma-query.base';
import { Option } from 'oxide.ts';

export interface RoleRepositoryPort extends RepositoryPort<RoleEntity> {
  findRoleByParams(
    params: PrismaQueryBase<Prisma.RoleWhereInput>,
  ): Promise<Option<RoleEntity>>;
}
