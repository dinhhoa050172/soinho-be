import { CommandBus } from '@nestjs/cqrs';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { RegisterRequestDto } from './register.request.dto';
import { RegisterCommand } from './register.command';
import { RegisterServiceResult } from './register.service';
import { routesV1 } from 'src/configs/app.route';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { match } from 'oxide.ts';
import { RegisterResponseDto } from '../../dtos/register.response.dto';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';

@ApiTags(API_V1_TAGS.AUTHENTICATION)
@Controller(routesV1.version)
export class RegisterHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterResponseDto,
  })
  @Post(routesV1.auth.register)
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const command = new RegisterCommand({
      ...body,
      createdBy: 'system',
    });

    const result: RegisterServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (data: RegisterResponseDto) => data,
      Err: (error) => {
        throw error;
      },
    });
  }
}
