import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ADDRESS_REPOSITORY } from './address.di-tokens';
import { CreateAddressHttpController } from './commands/create-address/create-address.http.controller';
import { CreateAddressService } from './commands/create-address/create-address.service';
import { DeleteAddressHttpController } from './commands/delete-address/delete-address.http.controller';
import { DeleteAddressService } from './commands/delete-address/delete-address.service';
import { UpdateAddressHttpController } from './commands/update-address/update-address.http.controller';
import { UpdateAddressService } from './commands/update-address/update-address.service';
import { PrismaAddressRepository } from './database/address.repository.prisma';
import { AddressMapper } from './mappers/address.mapper';
import { FindAddressHttpController } from './queries/find-address/find-address.http.controller';
import { FindAddressQueryHandler } from './queries/find-address/find-address.query-handler';
import { FindAddresssHttpController } from './queries/find-addresses/find-addresses.http.controller';
import { FindAddresssQueryHandler } from './queries/find-addresses/find-addresses.query-handler';

const httpControllers = [
  CreateAddressHttpController,
  UpdateAddressHttpController,
  DeleteAddressHttpController,
  FindAddressHttpController,
  FindAddresssHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  CreateAddressService,
  UpdateAddressService,
  DeleteAddressService,
];

const queryHandlers: Provider[] = [
  FindAddressQueryHandler,
  FindAddresssQueryHandler,
];

const mappers: Provider[] = [AddressMapper];

const repositories: Provider[] = [
  {
    provide: ADDRESS_REPOSITORY,
    useClass: PrismaAddressRepository,
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
export class AddressModule {}
