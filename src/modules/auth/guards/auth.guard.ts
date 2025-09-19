import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGY_NAME } from '../strategies/auth-jwt.strategy';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthJwtGuard extends AuthGuard(AUTH_STRATEGY_NAME) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
