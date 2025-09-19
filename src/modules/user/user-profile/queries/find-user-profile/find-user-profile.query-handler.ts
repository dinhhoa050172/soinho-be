import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Result, Err, Ok } from 'oxide.ts';
import { UserProfileNotFoundError } from '../../domain/user-profile.error';
import { UserProfileEntity } from '../../domain/user-profile.entity';
import { USER_PROFILE_REPOSITORY } from '../../user-profile.di-tokens';
import { UserProfileRepositoryPort } from '../../database/user-profile.repository.port';

export class FindUserProfileQuery {
  userId: bigint;

  constructor(public readonly id: bigint) {
    this.userId = id;
  }
}

export type FindUserProfileQueryResult = Result<
  UserProfileEntity,
  UserProfileNotFoundError
>;

@QueryHandler(FindUserProfileQuery)
export class FindUserProfileQueryHandler
  implements IQueryHandler<FindUserProfileQuery>
{
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    protected readonly userProfileRepo: UserProfileRepositoryPort,
  ) {}

  async execute(
    query: FindUserProfileQuery,
  ): Promise<FindUserProfileQueryResult> {
    const found = await this.userProfileRepo.findOneById(query.userId);
    if (found.isNone()) {
      return Err(new UserProfileNotFoundError());
    }
    return Ok(found.unwrap());
  }
}
