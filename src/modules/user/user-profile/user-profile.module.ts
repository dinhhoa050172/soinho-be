import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaUserProfileRepository } from './database/user-profile.repository.prisma';
import { UserProfileMapper } from './mappers/user-profile.mapper';
import { FindUserProfileHttpController } from './queries/find-user-profile/find-user-profile.http.controller';
import { FindUserProfileQueryHandler } from './queries/find-user-profile/find-user-profile.query-handler';
import { USER_PROFILE_REPOSITORY } from './user-profile.di-tokens';

const httpControllers = [FindUserProfileHttpController];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [];

const queryHandlers: Provider[] = [FindUserProfileQueryHandler];

const mappers: Provider[] = [UserProfileMapper];

const repositories: Provider[] = [
  {
    provide: USER_PROFILE_REPOSITORY,
    useClass: PrismaUserProfileRepository,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
  exports: [...mappers, ...repositories],
})
export class UserProfileModule {}
