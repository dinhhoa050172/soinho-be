import { match } from 'oxide.ts';

import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
  UseGuards,
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
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { OrderItemEntity } from '../../domain/order-item.entity';
import {
  OrderItemNotFoundError,
  OrderItemAlreadyInUseError,
} from '../../domain/order-item.error';
import { OrderItemResponseDto } from '../../dtos/order-item.response.dto';
import { OrderItemMapper } from '../../mappers/order-item.mapper';
import { UpdateOrderItemCommand } from './update-order-item.command';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { UpdateOrderItemRequestDto } from './update-order-item.request.dto';
import { UpdateOrderItemServiceResult } from './update-order-item.service';

@ApiTags(
  `${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}_${API_V1_TAGS.USER.ORDER.ORDER_ITEM}`,
)
@Controller(routesV1.version)
export class UpdateOrderItemHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: OrderItemMapper,
  ) {}

  @ApiOperation({ summary: 'Update a OrderItem' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'OrderItem ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderItemResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OrderItemNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Put(routesV1.user.order.orderItem.update)
  async update(
    @ReqUser() user: RequestUser,
    @Param('id') orderItemId: bigint,
    @Body() body: UpdateOrderItemRequestDto,
  ): Promise<OrderItemResponseDto> {
    const command = new UpdateOrderItemCommand({
      orderItemId,
      ...body,
      updatedBy: user.email,
    });

    const result: UpdateOrderItemServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (product: OrderItemEntity) => this.mapper.toResponse(product),
      Err: (error: Error) => {
        if (error instanceof OrderItemNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof OrderItemAlreadyInUseError) {
          throw new ConflictException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
