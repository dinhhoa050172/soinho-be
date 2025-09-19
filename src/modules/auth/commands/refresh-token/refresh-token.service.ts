import { Err, Ok, Result } from 'oxide.ts';
import { LoginResponseDto } from '../../dtos/login.response.dto';
import {
  InvalidTokenError,
  LoginError,
  SessionExpiredError,
} from '../../domain/auth.error';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import { CacheService } from 'src/libs/cache/cache.service';
import { UnauthorizedException } from '@nestjs/common';
import {
  FindUserByParamsQuery,
  FindUserByParamsQueryResult,
} from 'src/modules/sa/user/queries/find-user-by-params/find-user-by-params.query-handler';
import { UserMapper } from 'src/modules/sa/user/mappers/user.mapper';
import { v4 as uuidv4 } from 'uuid';

export type RefreshTokenServiceResult = Result<LoginResponseDto, LoginError>;

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenService
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly hashService: HashService,
    private readonly cacheService: CacheService,
    private readonly queryBus: QueryBus,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<RefreshTokenServiceResult> {
    try {
      const payload = this.hashService.verifyRefreshToken(command.refreshToken);
      if (!payload.id || !payload.email || !payload.sessionState) {
        throw new UnauthorizedException(InvalidTokenError);
      }

      const cachedSession = await this.cacheService.getSession(
        payload.email,
        payload.sessionState,
      );
      if (!cachedSession || cachedSession !== payload.sessionState) {
        throw new UnauthorizedException(SessionExpiredError);
      }

      const userFound: FindUserByParamsQueryResult =
        await this.queryBus.execute(
          new FindUserByParamsQuery({ where: { email: payload.email } }),
        );
      if (userFound.isErr()) {
        throw new UnauthorizedException(InvalidTokenError);
      }

      const userEnity = userFound.unwrap();
      const userDto = this.userMapper.toResponse(userEnity);
      const sessionState = `${userDto.id}.${uuidv4()}`;

      const newAccessToken = this.hashService.generateAccessToken({
        ...userDto,
        sessionState: sessionState,
      });

      const user: LoginResponseDto = {
        accessToken: newAccessToken,
        refreshToken: command.refreshToken,
        userProfile: {
          fullName: `${userDto.firstName} ${userDto.lastName}`,
          email: userDto.email,
          phone: userDto.phone,
          roleName: userDto.roleName,
          isActive: userDto.isActive,
          emailVerified: userDto.emailVerified,
        },
      };

      await this.cacheService.setSession(payload.email, sessionState);
      return Ok(user);
    } catch (error: any) {
      return Err(error);
    }
  }
}
