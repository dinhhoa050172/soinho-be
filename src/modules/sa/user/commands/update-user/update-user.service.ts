import { Err, Ok, Result } from 'oxide.ts';

import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { UserRepositoryPort } from '../../database/user.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { USER_REPOSITORY } from '../../user.di-tokens';
import {
  UserAlreadyInUseError,
  UserNotFoundError
} from '../../domain/user.error';

export type UpdateUserServiceResult = Result<UserEntity, any>;

@CommandHandler(UpdateUserCommand)
export class UpdateUserService implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UpdateUserServiceResult> {
    const existingUser = await this.userRepo.findOneById(command.userId);
    if (!existingUser) {
      return Err(new UserNotFoundError());
    }
    const userFound = existingUser.unwrap();
    const user = userFound.update({
      ...command.getExtendedProps<UpdateUserCommand>(),
    });
    if (user.isErr()) {
      return user;
    }
    try {
      const updatedUser = await this.userRepo.update(userFound);
      return Ok(updatedUser);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
