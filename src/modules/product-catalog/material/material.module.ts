import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MATERIAL_REPOSITORY } from './material.di-tokens';
import { PrismaMaterialRepository } from './database/material.repository.prisma';
import { FindMaterialsHttpController } from './queries/find-materials/find-materials.http.controller';
import { FindMaterialsQueryHandler } from './queries/find-materials/find-materials.query-handler';
import { MaterialMapper } from './mappers/material.mapper';
import { FindMaterialHttpController } from './queries/find-material/find-material.http.controller';
import { FindMaterialQueryHandler } from './queries/find-material/find-material.query-handler';
import { CreateMaterialHttpController } from './commands/create-material/create-material.http.controller';
import { CreateMaterialService } from './commands/create-material/create-material.service';
import { DeleteMaterialHttpController } from './commands/delete-material/delete-material.http.controller';
import { DeleteMaterialService } from './commands/delete-material/delete-material.service';
import { UpdateMaterialHttpController } from './commands/update-material/update-material.http.controller';
import { UpdateMaterialService } from './commands/update-material/update-material.service';

const httpControllers = [
  CreateMaterialHttpController,
  UpdateMaterialHttpController,
  DeleteMaterialHttpController,
  FindMaterialHttpController,
  FindMaterialsHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateMaterialService,
  UpdateMaterialService,
  DeleteMaterialService,
];

const queryHandlers: Provider[] = [
  FindMaterialQueryHandler,
  FindMaterialsQueryHandler,
];

const mappers: Provider[] = [MaterialMapper];

const repositories: Provider[] = [
  {
    provide: MATERIAL_REPOSITORY,
    useClass: PrismaMaterialRepository,
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
export class MaterialModule {}
