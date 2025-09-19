import { RepositoryPort } from 'src/libs/ddd';
import { AddressEntity } from '../domain/address.entity';
import { Option } from 'oxide.ts';

export interface AddressRepositoryPort extends RepositoryPort<AddressEntity> {
  findDefaultAddressByUserEmail(
    userEmail: string,
  ): Promise<Option<AddressEntity>>;
}
