import { Injectable } from '@nestjs/common';
import { AddressMapper } from '../mappers/address.mapper';
import { Address as AddressModel, Prisma } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { AddressEntity } from '../domain/address.entity';
import { AddressRepositoryPort } from './address.repository.port';
import { None, Option, Some } from 'oxide.ts';

export const AddressScalarFieldEnum = Prisma.AddressScalarFieldEnum;

@Injectable()
export class PrismaAddressRepository
  extends PrismaRepositoryBase<AddressEntity, AddressModel>
  implements AddressRepositoryPort
{
  protected modelName = 'address';

  constructor(
    private client: PrismaService,
    mapper: AddressMapper,
  ) {
    super(client, mapper);
  }
  async findDefaultAddressByUserEmail(
    userEmail: string,
  ): Promise<Option<AddressEntity>> {
    const found = await this.client.address.findFirst({
      where: {
        user: {
          email: userEmail.toString(),
        },
        isDefault: true,
      },
    });
    return found ? Some(this.mapper.toDomain(found)) : None;
  }
}
