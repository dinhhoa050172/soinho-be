import { match } from 'oxide.ts';
import {
  ConflictException as ConflictHttpException,
  Body,
  Controller,
  HttpStatus,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { OrderAlreadyExistsError } from '../../domain/order.error';
import { OrderResponseDto } from '../../dtos/order.response.dto';
import { OrderMapper } from '../../mappers/order.mapper';
import { UpdateOrderRequestDto } from './update-order.request.dto';
import { UpdateOrderServiceResult } from './update-order.service';
import { UpdateOrderCommand } from './update-order.command';
import { OrderEntity } from '../../domain/order.entity';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}`)
@Controller(routesV1.version)
export class UpdateOrderHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: OrderMapper,
  ) {}

  @ApiOperation({ summary: 'Update a Order' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Put(routesV1.user.order.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') orderId: bigint,
    @Body() body: UpdateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    const command = new UpdateOrderCommand({
      orderId,
      ...body,
      updatedBy: user.email,
    });

    const result: UpdateOrderServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (order: OrderEntity) => {
        return this.mapper.toResponse(order);
      },
      Err: (error: Error) => {
        if (error instanceof OrderAlreadyExistsError) {
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
