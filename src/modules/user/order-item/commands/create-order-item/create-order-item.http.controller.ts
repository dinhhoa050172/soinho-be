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
import { OrderItemEntity } from '../../domain/order-item.entity';
import { OrderItemAlreadyExistsError } from '../../domain/order-item.error';
import { OrderItemResponseDto } from '../../dtos/order-item.response.dto';
import { OrderItemMapper } from '../../mappers/order-item.mapper';
import { CreateOrderItemCommand } from './create-order-item.command';
import { CreateOrderItemRequestDto } from './create-order-item.request.dto';
import { CreateOrderItemServiceResult } from './create-order-item.service';

@ApiTags(
  `${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}_${API_V1_TAGS.USER.ORDER.ORDER_ITEM}`,
)
@Controller(routesV1.version)
export class CreateOrderItemHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: OrderItemMapper,
  ) {}

  @ApiOperation({ summary: 'Create a OrderItem' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OrderItemResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard)
  @Post(routesV1.user.order.orderItem.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateOrderItemRequestDto,
  ): Promise<OrderItemResponseDto> {
    const command = new CreateOrderItemCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateOrderItemServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (user: OrderItemEntity) => this.mapper.toResponse(user),
      Err: (error: Error) => {
        if (error instanceof OrderItemAlreadyExistsError) {
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
