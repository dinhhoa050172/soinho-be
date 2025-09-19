import {
  Controller,
  Body,
  HttpStatus,
  NotFoundException,
  ConflictException,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { match } from 'oxide.ts';
import { ResetPasswordRequestDto } from './reset-password.request.dto';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { RequestUser } from '../../../../auth/domain/value-objects/request-user.value-object';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { ResetPasswordCommand } from './reset-password.command';
import { ResetPasswordServiceResult } from './reset-password.service';
import {
  UserAlreadyInUseError,
  UserNotFoundError,
  WrongOldPasswordError,
} from '../../domain/user.error';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(API_V1_TAGS.SYSTEM_ADMIN)
@Controller(routesV1.version)
export class ResetPasswordHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Reset User Password',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: ResetPasswordError.name,
  //   type: ApiErrorResponse,
  // })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Put(routesV1.sa.user.resetPassword)
  async resetPassword(
    @ReqUser() user: RequestUser,
    @Body() body: ResetPasswordRequestDto,
  ): Promise<string> {
    const command = new ResetPasswordCommand({
      userEmail: user.email,
      ...body,
    });

    const result: ResetPasswordServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (message: string) => message,
      Err: (error: Error) => {
        if (error instanceof UserNotFoundError) {
          throw new NotFoundException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof UserAlreadyInUseError) {
          throw new ConflictException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof WrongOldPasswordError) {
          throw new BadRequestException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
