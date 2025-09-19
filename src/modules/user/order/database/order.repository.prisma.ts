import { Injectable } from '@nestjs/common';
import { OrderMapper } from '../mappers/order.mapper';
import { Order as OrderModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { OrderEntity } from '../domain/order.entity';
import { OrderRepositoryPort } from './order.repository.port';
import { None, Option, Some } from 'oxide.ts';

export const OrderScalarFieldEnum = Prisma.OrderScalarFieldEnum;

@Injectable()
export class PrismaOrderRepository
  extends PrismaRepositoryBase<OrderEntity, OrderModel>
  implements OrderRepositoryPort
{
  protected modelName = 'order';

  constructor(
    private client: PrismaService,
    mapper: OrderMapper,
  ) {
    super(client, mapper);
  }
  async findPaymentMethodById(
    paymentMethodId: bigint,
  ): Promise<Option<OrderEntity>> {
    const data = await this.client.order.findFirst({
      where: {
        id: paymentMethodId,
      },
    });
    return data ? Some(this.mapper.toDomain(data)) : None;
  }
}
