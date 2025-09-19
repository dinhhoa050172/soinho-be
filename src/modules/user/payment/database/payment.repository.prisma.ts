import { Injectable } from '@nestjs/common';
import { PaymentMapper } from '../mappers/payment.mapper';
import { Payment as PaymentModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { PaymentEntity } from '../domain/payment.entity';
import { PaymentRepositoryPort } from './payment.repository.port';
import { None, Option, Some } from 'oxide.ts';

export const PaymentScalarFieldEnum = Prisma.PaymentScalarFieldEnum;

@Injectable()
export class PrismaPaymentRepository
  extends PrismaRepositoryBase<PaymentEntity, PaymentModel>
  implements PaymentRepositoryPort
{
  protected modelName = 'payment';

  constructor(
    private client: PrismaService,
    mapper: PaymentMapper,
  ) {
    super(client, mapper);
  }
  async findOrderById(orderId: bigint): Promise<Option<PaymentEntity>> {
    const data = await this.client.payment.findFirst({
      where: {
        orderId,
      },
    });
    return data ? Some(this.mapper.toDomain(data)) : None;
  }
}
