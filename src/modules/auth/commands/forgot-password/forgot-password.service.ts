import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { ForgotPasswordCommand } from './forgot-password.command';
import { Err, Ok, Result } from 'oxide.ts';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import {
  FindUserByParamsQuery,
  FindUserByParamsQueryResult,
} from 'src/modules/sa/user/queries/find-user-by-params/find-user-by-params.query-handler';
import { UserNotFoundError } from 'src/modules/sa/user/domain/user.error';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from 'src/libs/cache/cache.service';
import { RegisterResponseDto } from '../../dtos/register.response.dto';
import { MailerService } from 'src/libs/mailer/mailer.service';
import { ForgotPasswordResponseDto } from '../../dtos/forgot-password.response.dto';

export type ForgotPasswordServiceResult = Result<
  ForgotPasswordResponseDto,
  UserNotFoundError
>;

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordService
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly hashService: HashService,
    private readonly cacheService: CacheService,
    private readonly emailService: MailerService,
  ) {}

  async execute(
    command: ForgotPasswordCommand,
  ): Promise<ForgotPasswordServiceResult> {
    const userFound: FindUserByParamsQueryResult = await this.queryBus.execute(
      new FindUserByParamsQuery({
        where: { email: command.email, isActive: true },
      }),
    );
    if (userFound.isErr()) {
      return Err(new UserNotFoundError());
    }

    const userProps = userFound.unwrap().getProps();
    const sessionState = `${userProps.id}.${uuidv4()}`;

    const token = this.hashService.generateEmailToken({
      id: Number(userProps.id),
      email: userProps.email,
      sessionState,
      type: 'forgot-password',
    });
    const cacheKey = `forgot-password.${sessionState}`;
    await this.cacheService.set(cacheKey, userProps.email, 60 * 60); // 1 hour
    await this.emailService.sendResetPasswordEmail(command.email, token);
    const response: RegisterResponseDto = {
      msg: 'Đã gửi email đặt lại mật khẩu',
    };

    return Ok(response);
  }
}
