import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import { CacheService } from 'src/libs/cache/cache.service';

@CommandHandler(LogoutCommand)
export class LogoutService implements ICommandHandler<LogoutCommand> {
  constructor(
    private readonly hashService: HashService,
    private readonly cacheService: CacheService,
  ) {}
  async execute(command: LogoutCommand): Promise<void> {
    try {
      const payload = this.hashService.verifyToken(command.token);
      const session = await this.cacheService.getSession(
        payload.email,
        payload.sessionState,
      );
      await this.cacheService.delSession(payload.email, session);
    } catch (error) {
      console.error(error);
    }
  }
}
