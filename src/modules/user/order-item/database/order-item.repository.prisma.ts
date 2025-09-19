import { Injectable } from '@nestjs/common';
import { OrderItemMapper } from '../mappers/order-item.mapper';
import { OrderItem as OrderItemModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { OrderItemEntity } from '../domain/order-item.entity';
import { OrderItemRepositoryPort } from './order-item.repository.port';

export const OrderItemScalarFieldEnum = Prisma.OrderItemScalarFieldEnum;

@Injectable()
export class PrismaOrderItemRepository
  extends PrismaRepositoryBase<OrderItemEntity, OrderItemModel>
  implements OrderItemRepositoryPort
{
  protected modelName = 'orderItem';

  constructor(
    private client: PrismaService,
    mapper: OrderItemMapper,
  ) {
    super(client, mapper);
  }
}
