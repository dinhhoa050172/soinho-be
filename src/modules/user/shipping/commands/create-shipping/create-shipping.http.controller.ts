import { match } from 'oxide.ts';
import {
  ConflictException as ConflictHttpException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { CreateShippingCommand } from './create-shipping.command';
import { CreateShippingRequestDto } from './create-shipping.request.dto';
import { CreateShippingServiceResult } from './create-shipping.service';
import { ShippingMapper } from '../../mappers/shipping.mapper';
import { ShippingResponseDto } from '../../dtos/shipping.response.dto';
import { ShippingEntity } from '../../domain/shipping.entity';
import { ShippingAlreadyExistsError } from '../../domain/shipping.error';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.SHIPPING}`)
@Controller(routesV1.version)
export class CreateShippingHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ShippingMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Shipping' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ShippingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard)
  @Post(routesV1.user.shipping.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateShippingRequestDto,
  ): Promise<ShippingResponseDto> {
    const command = new CreateShippingCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateShippingServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (user: ShippingEntity) => this.mapper.toResponse(user),
      Err: (error: Error) => {
        if (error instanceof ShippingAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
