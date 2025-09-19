import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FindRoleByParamsQueryHandler } from './queries/find-role-by-params/find-role-by-params.query-handler';
import { RoleMapper } from './mappers/role.mapper';
import { ROLE_REPOSITORY } from './role.di-tokens';
import { PrismaRoleRepository } from './database/role.repository.prisma';
import { CreateRoleHttpController } from './commands/create-role/create-role.http.controller';
import { CreateRoleService } from './commands/create-role/create-role.service';

const httpControllers = [CreateRoleHttpController];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [CreateRoleService];

const queryHandlers: Provider[] = [FindRoleByParamsQueryHandler];

const mappers: Provider[] = [RoleMapper];

const repositories: Provider[] = [
  {
    provide: ROLE_REPOSITORY,
    useClass: PrismaRoleRepository,
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
})
export class RoleModule {}
