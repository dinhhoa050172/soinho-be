import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { ADDRESS_REPOSITORY } from '../../address.di-tokens';
import { AddressRepositoryPort } from '../../database/address.repository.port';
import { AddressEntity } from '../../domain/address.entity';
import { AddressAlreadyExistsError } from '../../domain/address.error';
import { CreateAddressCommand } from './create-address.command';
import { UpdateAddressCommand } from '../update-address/update-address.command';
import {
  FindUserByParamsQuery,
  FindUserByParamsQueryResult,
} from 'src/modules/sa/user/queries/find-user-by-params/find-user-by-params.query-handler';

export type CreateAddressServiceResult = Result<AddressEntity, any>;

@CommandHandler(CreateAddressCommand)
export class CreateAddressService
  implements ICommandHandler<CreateAddressCommand>
{
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    protected readonly addressRepo: AddressRepositoryPort,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(
    command: CreateAddressCommand,
  ): Promise<CreateAddressServiceResult> {
    if (command.isDefault === true) {
      //check if there is an default address for the user, if yes, set that address as not default
      const existingAddress =
        await this.addressRepo.findDefaultAddressByUserEmail(command.userEmail);
      if (existingAddress.isSome()) {
        const updatedOldDefaultAddress = await this.commandBus.execute(
          new UpdateAddressCommand({
            userEmail: command.userEmail,
            addressId: existingAddress.unwrap().id,
            isDefault: false,
            updatedBy: command.createdBy,
          }),
        );
        if (updatedOldDefaultAddress.isErr()) {
          console.log(
            'Error updating old default address to not default:',
            updatedOldDefaultAddress.error,
          );
        }
      }
    }
    const user: FindUserByParamsQueryResult = await this.queryBus.execute(
      new FindUserByParamsQuery({
        where: {
          email: command.userEmail,
        },
      }),
    );
    if (user.isErr()) {
      throw user.unwrapErr();
    }
    const address = AddressEntity.create({
      ...command.getExtendedProps<CreateAddressCommand>(),
      userId: user.unwrap().getProps().id,
    });

    try {
      const createdAddress = await this.addressRepo.insert(address);
      return Ok(createdAddress);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new AddressAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
