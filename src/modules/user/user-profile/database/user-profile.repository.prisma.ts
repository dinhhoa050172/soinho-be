import { Injectable } from '@nestjs/common';
import { UserProfileEntity } from '../domain/user-profile.entity';
import { User as UserModel } from '@prisma/client';
import { PrismaRepositoryBase } from 'src/libs/db/prisma-repository.base';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { UserProfileMapper } from '../mappers/user-profile.mapper';
import { UserProfileRepositoryPort } from './user-profile.repository.port';

@Injectable()
export class PrismaUserProfileRepository
  extends PrismaRepositoryBase<UserProfileEntity, UserModel>
  implements UserProfileRepositoryPort
{
  protected modelName = 'user';

  constructor(
    private client: PrismaService,
    mapper: UserProfileMapper,
  ) {
    super(client, mapper);
  }
}
