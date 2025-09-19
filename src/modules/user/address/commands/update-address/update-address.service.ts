import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from 'src/libs/exceptions';
import { ADDRESS_REPOSITORY } from '../../address.di-tokens';
import { AddressRepositoryPort } from '../../database/address.repository.port';
import { AddressEntity } from '../../domain/address.entity';
import {
  AddressNotFoundError,
  AddressAlreadyInUseError,
} from '../../domain/address.error';
import { UpdateAddressCommand } from './update-address.command';

export type UpdateAddressServiceResult = Result<
  AddressEntity,
  AddressNotFoundError | AddressAlreadyInUseError
>;

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressService
  implements ICommandHandler<UpdateAddressCommand>
{
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    protected readonly addressRepo: AddressRepositoryPort,
  ) {}

  async execute(
    command: UpdateAddressCommand,
  ): Promise<UpdateAddressServiceResult> {
    let updatedOldDefaultAddress: AddressEntity | undefined;
    const found = await this.addressRepo.findOneByParams({
      where: {
        id: command.addressId,
      },
      include: {
        user: true,
      },
    });
    if (found.isNone()) {
      return Err(new AddressNotFoundError());
    }
    //if update address to be default, check if there is an existing default address for the user
    if (command.isDefault === true) {
      const existingAddress =
        await this.addressRepo.findDefaultAddressByUserEmail(command.userEmail);

      if (existingAddress.isSome()) {
        updatedOldDefaultAddress = existingAddress.unwrap();
        if (existingAddress.unwrap().getProps().id !== command.addressId) {
          //if there is an existing default address, set it to not default
          const updatedOldDefaultAddress = existingAddress.unwrap().update({
            isDefault: false,
            updatedBy: command.updatedBy,
          });
          if (updatedOldDefaultAddress.isErr()) {
            console.log(
              'Error updating old default address to not default:',
              updatedOldDefaultAddress.unwrapErr(),
            );
          }
        }
      }
    }

    const address = found.unwrap();
    const updatedAddress = address.update({
      ...command.getExtendedProps<UpdateAddressCommand>(),
    });

    if (updatedAddress.isErr()) {
      return Err(updatedAddress.unwrapErr());
    }

    try {
      const updatedProduct = await this.addressRepo.update(address);
      if (updatedOldDefaultAddress) {
        await this.addressRepo.update(updatedOldDefaultAddress);
      }
      return Ok(updatedProduct);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new AddressAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
