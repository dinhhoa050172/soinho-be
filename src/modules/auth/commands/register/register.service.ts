import { Err, Ok, Result } from 'oxide.ts';
import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import {
  FindUserByParamsQuery,
  FindUserByParamsQueryResult,
} from 'src/modules/sa/user/queries/find-user-by-params/find-user-by-params.query-handler';
import { EmailHasBeenRegisteredError } from '../../domain/auth.error';
import { HashService } from 'src/libs/utils/auth-jwt.util';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from 'src/libs/cache/cache.service';
import { CreateUserServiceResult } from 'src/modules/sa/user/commands/create-user/create-user.service';
import { CreateUserCommand } from 'src/modules/sa/user/commands/create-user/create-user.command';
import { RegisterResponseDto } from '../../dtos/register.response.dto';
import { MailerService } from 'src/libs/mailer/mailer.service';
import { Role } from '../../domain/role.type';
import { CreateCartCommand } from 'src/modules/user/cart/commands/create-cart/create-cart.command';

export type RegisterServiceResult = Result<RegisterResponseDto, any>;

@CommandHandler(RegisterCommand)
export class RegisterService implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly emailService: MailerService,
    private readonly hashService: HashService,
    private readonly cacheService: CacheService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterServiceResult> {
    const existingUser: FindUserByParamsQueryResult =
      await this.queryBus.execute(
        new FindUserByParamsQuery({
          where: { email: command.email },
        }),
      );
    if (existingUser.isOk()) {
      return Err(new EmailHasBeenRegisteredError());
    }

    const registerUser: CreateUserServiceResult = await this.commandBus.execute(
      new CreateUserCommand({
        ...command.getExtendedProps<RegisterCommand>(),
        roleName: Role.CUSTOMER,
      }),
    );

    const registerUserProps = registerUser.unwrap().getProps();
    const sessionState = `${registerUserProps.id}.${uuidv4()}`;

    const token = this.hashService.generateEmailToken({
      id: Number(registerUserProps.id),
      email: registerUserProps.email,
      sessionState,
      type: 'verify-email',
    });

    // tạo giỏ hàng sau khi đăng ký
    await this.commandBus.execute(
      new CreateCartCommand({
        userId: registerUserProps.id,
        createdBy: registerUserProps.email,
      }),
    );

    await this.cacheService.setSession(registerUserProps.email, sessionState);

    await this.emailService.sendVerificationEmail(command.email, token);

    const response: RegisterResponseDto = {
      msg: 'Đăng ký tài khoản thành công, đã gửi email xác thực',
    };

    return Ok(response);
  }
}
