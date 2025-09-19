import { Injectable } from '@nestjs/common';
import { PaymentMethodMapper } from '../mappers/payment-method.mapper';
import { PaymentMethod as PaymentMethodModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { PaymentMethodEntity } from '../domain/payment-method.entity';
import { PaymentMethodRepositoryPort } from './payment-method.repository.port';

export const PaymentMethodScalarFieldEnum = Prisma.PaymentMethodScalarFieldEnum;

@Injectable()
export class PrismaPaymentMethodRepository
  extends PrismaRepositoryBase<PaymentMethodEntity, PaymentMethodModel>
  implements PaymentMethodRepositoryPort
{
  protected modelName = 'paymentMethod';

  constructor(
    private client: PrismaService,
    mapper: PaymentMethodMapper,
  ) {
    super(client, mapper);
  }
}
