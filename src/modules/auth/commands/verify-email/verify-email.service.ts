import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify-email.command';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import { Ok, Result } from 'oxide.ts';
import { CacheService } from 'src/libs/cache/cache.service';
import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  InvalidTokenError,
  SessionExpiredError,
} from '../../domain/auth.error';
import {
  FindUserByParamsQuery,
  FindUserByParamsQueryResult,
} from 'src/modules/sa/user/queries/find-user-by-params/find-user-by-params.query-handler';
import { UserRepositoryPort } from 'src/modules/sa/user/database/user.repository.port';
import { USER_REPOSITORY } from 'src/modules/sa/user/user.di-tokens';
import { VerifyEmailResponseDto } from '../../dtos/verify-email.response.dto';

export type VerifyEmailServiceResult = Result<VerifyEmailResponseDto, any>;

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailService implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    protected readonly userRepo: UserRepositoryPort,
    private readonly hashService: HashService,
    private readonly cacheService: CacheService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(
    command: VerifyEmailCommand,
  ): Promise<VerifyEmailServiceResult> {
    const payload = this.hashService.verifyEmailToken(command.token);
    if (
      !payload.id ||
      !payload.email ||
      !payload.sessionState ||
      payload.type !== 'verify-email'
    ) {
      throw new UnauthorizedException(InvalidTokenError);
    }

    const cachedSession = await this.cacheService.getSession(
      payload.email,
      payload.sessionState,
    );
    if (!cachedSession || cachedSession !== payload.sessionState) {
      throw new UnauthorizedException(SessionExpiredError);
    }

    const userFound: FindUserByParamsQueryResult = await this.queryBus.execute(
      new FindUserByParamsQuery({
        where: { email: payload.email, isActive: true },
      }),
    );
    if (userFound.isErr()) {
      throw new UnauthorizedException(InvalidTokenError);
    } else {
      userFound.unwrap().update({
        emailVerified: true,
        updatedBy: 'system',
      });
    }
    await this.userRepo.update(userFound.unwrap());

    const response: VerifyEmailResponseDto = {
      msg: 'Xác thực email thành công',
    };
    return Ok(response);
  }
}
