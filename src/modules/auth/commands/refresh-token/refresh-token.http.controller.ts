import { match } from 'oxide.ts';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenCommand } from './refresh-token.command';
import { RefreshTokenRequestDto } from './refresh-token.request.dto';
import { RefreshTokenServiceResult } from './refresh-token.service';
import { LoginError } from '../../domain/auth.error';
import { LoginResponseDto } from '../../dtos/login.response.dto';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';

@ApiTags(API_V1_TAGS.AUTHENTICATION)
@Controller(routesV1.version)
export class RefreshTokenHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Refresh token',
    description: 'Exchange refresh token for access token',
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
  @HttpCode(HttpStatus.OK)
  @Post(routesV1.auth.refreshToken)
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<LoginResponseDto> {
    const command = new RefreshTokenCommand({
      refreshToken: body.refreshToken,
    });
    const result: RefreshTokenServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (data: LoginResponseDto) => data,
      Err: (error: Error) => {
        throw new BadRequestException({
          message: error.message,
          errorCode: error.name,
        });
      },
    });
  }
}
