import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/configs/app.route';
import { LogoutCommand } from './logout.command';
import { LogoutRequestDto } from './logout.request.dto';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';

@ApiTags(API_V1_TAGS.AUTHENTICATION)
@Controller(routesV1.version)
export class LogoutHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Logout',
    description: 'Logout user and remove sessions from server',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(routesV1.auth.logout)
  async logout(@Body() body: LogoutRequestDto): Promise<void> {
    const command = new LogoutCommand(body);

    await this.commandBus.execute(command);
  }
}
