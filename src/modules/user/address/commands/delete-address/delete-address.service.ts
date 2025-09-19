import { Err, Ok, Result } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAddressCommand } from './delete-address.command';
import { ADDRESS_REPOSITORY } from '../../address.di-tokens';
import { AddressRepositoryPort } from '../../database/address.repository.port';
import { AddressEntity } from '../../domain/address.entity';
import { AddressNotFoundError } from '../../domain/address.error';

export type DeleteAddressServiceResult = Result<
  boolean,
  AddressNotFoundError
>;

@CommandHandler(DeleteAddressCommand)
export class DeleteAddressService
  implements ICommandHandler<DeleteAddressCommand>
{
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    protected readonly addressRepo: AddressRepositoryPort,
  ) {}

  async execute(
    command: DeleteAddressCommand,
  ): Promise<DeleteAddressServiceResult> {
    try {
      const result = await this.addressRepo.delete({
        id: command.addressId,
      } as AddressEntity);

      return Ok(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Err(new AddressNotFoundError(error));
      }

      throw error;
    }
  }
}
