import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserMapper } from './mappers/user.mapper';
import { FindUserByParamsQueryHandler } from './queries/find-user-by-params/find-user-by-params.query-handler';
import { PrismaUserRepository } from './database/user.repository.prisma';
import { USER_REPOSITORY } from './user.di-tokens';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { CreateUserService } from './commands/create-user/create-user.service';
import { UpdateUserService } from './commands/update-user/update-user.service';
import { UpdateUserHttpController } from './commands/update-user/update-user.http.controller';
import { ResetPasswordHttpController } from './commands/reset-password/reset-password.http.controller';
import { ResetPasswordService } from './commands/reset-password/reset-password.service';
import { HashService } from 'src/libs/utils/auth-jwt.util';

const httpControllers = [
  CreateUserHttpController,
  UpdateUserHttpController,
  ResetPasswordHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateUserService,
  UpdateUserService,
  ResetPasswordService,
];

const queryHandlers: Provider[] = [FindUserByParamsQueryHandler];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
];
const utils: Provider[] = [HashService];

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
    ...utils,
  ],
  exports: [...repositories],
})
export class UserModule {}
