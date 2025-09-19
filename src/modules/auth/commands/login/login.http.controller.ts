import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Result, match } from 'oxide.ts';
import { LoginError } from '../../domain/auth.error';
import { LoginResponseDto } from '../../dtos/login.response.dto';
import { LoginCommand } from './login.command';
import { LoginRequestDto } from './login.request.dto';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { routesV1 } from 'src/configs/app.route';

@ApiTags(API_V1_TAGS.AUTHENTICATION)
@Controller(routesV1.version)
export class LoginHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Login',
    description: 'input email and password to login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: LoginError.name,
    type: ApiErrorResponse,
  })
  @Post(routesV1.auth.login)
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const command = new LoginCommand(body);

    const result: Result<LoginResponseDto, LoginError> =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (data: LoginResponseDto) => data,
      Err: (error: Error) => {
        if (error instanceof LoginError) {
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
