import { Injectable } from '@nestjs/common';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { Transaction as TransactionModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { TransactionEntity } from '../domain/transaction.entity';
import { TransactionRepositoryPort } from './transaction.repository.port';

export const TransactionScalarFieldEnum = Prisma.TransactionScalarFieldEnum;

@Injectable()
export class PrismaTransactionRepository
  extends PrismaRepositoryBase<TransactionEntity, TransactionModel>
  implements TransactionRepositoryPort
{
  protected modelName = 'transaction';

  constructor(
    private client: PrismaService,
    mapper: TransactionMapper,
  ) {
    super(client, mapper);
  }
  async findByOrderId(orderId: bigint): Promise<TransactionEntity[]> {
    const data = await this.client.transaction.findMany({
      where: { orderId },
    });
    if (!data || data.length === 0) {
      return [];
    }
    return data.map((item) => this.mapper.toDomain(item));
  }
}
