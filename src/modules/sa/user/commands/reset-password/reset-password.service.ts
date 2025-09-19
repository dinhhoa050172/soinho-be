import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import {
  UserAlreadyInUseError,
  UserNotFoundError,
  WrongOldPasswordError,
} from 'src/modules/sa/user/domain/user.error';
import { ResetPasswordCommand } from './reset-password.command';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserRepositoryPort } from '../../database/user.repository.port';
import { ConflictException } from 'src/libs/exceptions';

export type ResetPasswordServiceResult = Result<
  string,
  UserNotFoundError | WrongOldPasswordError | UserAlreadyInUseError
>;

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordService
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly hashService: HashService,
    private readonly commandBus: CommandBus,
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(
    command: ResetPasswordCommand,
  ): Promise<ResetPasswordServiceResult> {
    const { oldPassword, newPassword, userEmail } = command;
    const user = await this.userRepo.findOneByParams({
      where: {
        email: userEmail,
        isActive: true,
      },
    });
    const userFound = user.unwrap();
    const userProps = userFound.getProps();
    const isValidPassword = await this.hashService.verifyPassword(
      oldPassword,
      userProps.password,
    );
    if (!isValidPassword) return Err(new WrongOldPasswordError());
    const hashedNewPassword = await this.hashService.hashPassword(newPassword);
    const updatedUser = userFound.update({
      password: hashedNewPassword,
      updatedBy: userEmail,
    });
    if (updatedUser.isErr()) {
      return updatedUser;
    }
    try {
      await this.userRepo.update(userFound);
      return Ok('Password updated successfully');
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
