import { Injectable } from '@nestjs/common';
import { MaterialMapper } from '../mappers/material.mapper';
import { Material as MaterialModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { MaterialEntity } from '../domain/material.entity';
import { MaterialRepositoryPort } from './material.repository.port';

export const MaterialScalarFieldEnum = Prisma.MaterialScalarFieldEnum;

@Injectable()
export class PrismaMaterialRepository
  extends PrismaRepositoryBase<MaterialEntity, MaterialModel>
  implements MaterialRepositoryPort
{
  protected modelName = 'material';

  constructor(
    private client: PrismaService,
    mapper: MaterialMapper,
  ) {
    super(client, mapper);
  }
}
