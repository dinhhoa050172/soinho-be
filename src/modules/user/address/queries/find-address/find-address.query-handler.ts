import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ADDRESS_REPOSITORY } from '../../address.di-tokens';
import { AddressRepositoryPort } from '../../database/address.repository.port';
import { AddressEntity } from '../../domain/address.entity';
import { AddressNotFoundError } from '../../domain/address.error';

export class FindAddressQuery {
  addressId: bigint;

  constructor(public readonly id: bigint) {
    this.addressId = id;
  }
}

export type FindAddressQueryResult = Result<
  AddressEntity,
  AddressNotFoundError
>;

@QueryHandler(FindAddressQuery)
export class FindAddressQueryHandler
  implements IQueryHandler<FindAddressQuery>
{
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    protected readonly addressRepo: AddressRepositoryPort,
  ) {}

  async execute(query: FindAddressQuery): Promise<FindAddressQueryResult> {
    const found = await this.addressRepo.findOneById(query.addressId);
    if (found.isNone()) return Err(new AddressNotFoundError());

    return Ok(found.unwrap());
  }
}
