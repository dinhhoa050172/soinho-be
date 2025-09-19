import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { CacheService } from 'src/libs/cache/cache.service';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import { Request } from 'express';
import { TIME } from 'src/libs/constants/constanst';
import { InvalidTokenError, SessionExpiredError } from '../domain/auth.error';
import { QueryBus } from '@nestjs/cqrs';

type DoneCallBack = (err: any, user?: any, info?: any) => void;

export const AUTH_STRATEGY_NAME = 'auth-jwt';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY_NAME,
) {
  constructor(
    private readonly hashService: HashService,
    private readonly cacheService: CacheService,
    private readonly queryBus: QueryBus,
  ) {
    super();
  }

  async validate(req: Request, done: DoneCallBack): Promise<void> {
    const token = this._extractTokenFromRequest(req);

    if (!token) {
      return done(new UnauthorizedException('No auth token'), false);
    }

    try {
      const payload = this.hashService.verifyToken(token);
      if (!payload.sessionState || !payload.email) {
        return done(new UnauthorizedException(), false);
      }

      const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại bằng giây
      if (payload.exp && payload.exp < currentTime) {
        return done(new UnauthorizedException('Token expired'), false); // Token hết hạn
      }

      const session = await this.cacheService.getSession(
        payload.email,
        payload.sessionState,
      );

      if (!session) {
        return done(new UnauthorizedException(SessionExpiredError), false);
      }

      const ttl = await this.cacheService.ttl(session);
      if (ttl > 0 && ttl < TIME.HOUR * 8) {
        await this.cacheService.setSession(payload.email, payload.sessionState);
      }

      // let roleDto: { roleId: bigint; roleName: string } | null = null;
      // if (payload.roleId) {
      //   const roleFound: FindRoleByParamsQueryResult =
      //     await this.queryBus.execute(
      //       new FindRoleByParamsQuery({ where: { id: payload.roleId } }),
      //     );
      //   if (roleFound.isOk() && roleFound.unwrap().getProps().isActive) {
      //     roleDto = {
      //       roleId: roleFound.unwrap().getProps().id,
      //       roleName: roleFound.unwrap().getProps().roleName,
      //     };
      //   }
      // }

      // TODO: kiểm tra user is_active
      // payload.role = roleDto;
      done(null, payload);
    } catch (error) {
      done(new UnauthorizedException(InvalidTokenError), false);
    }
  }

  private _extractTokenFromRequest(req: Request): string | null {
    // extract token from headers
    if (req.headers?.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
      }
    }

    // extract token from query params
    if (req.query?.token) {
      return req.query.token as string;
    }

    return null;
  }
}
