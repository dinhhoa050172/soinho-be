import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { Err, Ok, Result } from 'oxide.ts';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import {
  FindUserByParamsQuery,
  FindUserByParamsQueryResult,
} from 'src/modules/sa/user/queries/find-user-by-params/find-user-by-params.query-handler';
import { UserNotFoundError } from 'src/modules/sa/user/domain/user.error';
import { LoginError } from '../../domain/auth.error';
import { UserMapper } from 'src/modules/sa/user/mappers/user.mapper';
import { v4 as uuidv4 } from 'uuid';
import { LoginResponseDto } from '../../dtos/login.response.dto';
import { CacheService } from 'src/libs/cache/cache.service';

export type LoginServiceResult = Result<
  LoginResponseDto,
  UserNotFoundError | LoginError
>;

@CommandHandler(LoginCommand)
export class LoginService implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly hashService: HashService,
    private readonly cacheService: CacheService,
    private readonly queryBus: QueryBus,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(command: LoginCommand): Promise<LoginServiceResult> {
    try {
      const userFound: FindUserByParamsQueryResult =
        await this.queryBus.execute(
          new FindUserByParamsQuery({
            where: { email: command.email, isActive: true },
          }),
        );
      if (userFound.isErr()) {
        return Err(new UserNotFoundError());
      }

      const userEntity = userFound.unwrap();
      const isValidPassword = await this.hashService.verifyPassword(
        command.password,
        userEntity.getProps().password,
      );
      if (!isValidPassword) return Err(new LoginError());

      const userDto = this.userMapper.toResponse(userEntity);
      const sessionState = `${userDto.id}.${uuidv4()}`;

      const accessToken = this.hashService.generateAccessToken({
        ...userDto,
        sessionState,
      });

      const refreshToken = this.hashService.generateRefreshToken({
        id: userDto.id,
        email: userDto.email,
        sessionState: sessionState,
      });

      const user: LoginResponseDto = {
        accessToken,
        refreshToken,
        userProfile: {
          fullName: `${userDto.firstName} ${userDto.lastName}`,
          email: userDto.email,
          phone: userDto.phone,
          roleName: userDto.roleName,
          isActive: userDto.isActive,
          emailVerified: userDto.emailVerified,
        },
      };

      await this.cacheService.setSession(userDto.email, sessionState);
      return Ok(user);
    } catch (error) {
      if (error instanceof LoginError) {
        return Err(new LoginError(error));
      }
      throw error;
    }
  }
}
