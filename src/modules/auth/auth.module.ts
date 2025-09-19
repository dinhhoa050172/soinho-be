import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserMapper } from '../sa/user/mappers/user.mapper';
import { LoginHttpController } from './commands/login/login.http.controller';
import { LoginService } from './commands/login/login.service';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import { AuthJwtStrategy } from './strategies/auth-jwt.strategy';
import { LogoutHttpController } from './commands/logout/logout.http.controller';
import { LogoutService } from './commands/logout/logout.service';
import { RefreshTokenHttpController } from './commands/refresh-token/refresh-token.http.controller';
import { RefreshTokenService } from './commands/refresh-token/refresh-token.service';
import { RegisterHttpController } from './commands/register/register.http.controller';
import { RegisterService } from './commands/register/register.service';
import { UserModule } from '../sa/user/user.module';
import { VerifyEmailService } from './commands/verify-email/verify-email.service';
import { VerifyEmailHttpController } from './commands/verify-email/verify-email.http.controller';
import { MailerService } from 'src/libs/mailer/mailer.service';

const httpControllers = [
  RegisterHttpController,
  LoginHttpController,
  LogoutHttpController,
  RefreshTokenHttpController,
  VerifyEmailHttpController,
];

const messageControllers = [];

const cliControllers: Provider[] = [];

const graphqlResolvers: Provider[] = [];

const commandHandlers: Provider[] = [
  RegisterService,
  LoginService,
  LogoutService,
  RefreshTokenService,
  VerifyEmailService,
];

const queryHandlers: Provider[] = [];

const mappers: Provider[] = [UserMapper];

const repositories: Provider[] = [];

const utils: Provider[] = [HashService, MailerService];

@Module({
  imports: [CqrsModule, UserModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    Logger,
    AuthJwtStrategy,
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
    ...utils,
  ],
})
export class AuthModule {}
