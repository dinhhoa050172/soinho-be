import { RepositoryPort } from 'src/libs/ddd';
import { UserProfileEntity } from '../domain/user-profile.entity';

export type UserProfileRepositoryPort = RepositoryPort<UserProfileEntity>;
