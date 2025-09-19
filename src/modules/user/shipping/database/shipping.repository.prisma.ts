import { Injectable } from '@nestjs/common';
import { ShippingMapper } from '../mappers/shipping.mapper';
import { Shipping as ShippingModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { ShippingEntity } from '../domain/shipping.entity';
import { ShippingRepositoryPort } from './shipping.repository.port';

export const ShippingScalarFieldEnum = Prisma.ShippingScalarFieldEnum;

@Injectable()
export class PrismaShippingRepository
  extends PrismaRepositoryBase<ShippingEntity, ShippingModel>
  implements ShippingRepositoryPort
{
  protected modelName = 'shipping';

  constructor(
    private client: PrismaService,
    mapper: ShippingMapper,
  ) {
    super(client, mapper);
  }
}
