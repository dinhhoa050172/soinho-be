import { CommandBus } from '@nestjs/cqrs';
import { Body, Controller, HttpStatus, Put } from '@nestjs/common';
import { routesV1 } from 'src/configs/app.route';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { match } from 'oxide.ts';
import { VerifyEmailCommand } from './verify-email.command';
import { VerifyEmailRequestDto } from './verify-email.request.dto';
import { VerifyEmailServiceResult } from './verify-email.service';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { VerifyEmailResponseDto } from '../../dtos/verify-email.response.dto';

@ApiTags(API_V1_TAGS.AUTHENTICATION)
@Controller(routesV1.version)
export class VerifyEmailHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Xác thực email' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VerifyEmailResponseDto,
  })
  @Put(routesV1.auth.verifyEmail)
  async verifyEmail(
    @Body() body: VerifyEmailRequestDto,
  ): Promise<VerifyEmailResponseDto> {
    const command = new VerifyEmailCommand({
      ...body,
    });

    const result: VerifyEmailServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (data: VerifyEmailResponseDto) => data,
      Err: (error) => {
        throw error;
      },
    });
  }
}
