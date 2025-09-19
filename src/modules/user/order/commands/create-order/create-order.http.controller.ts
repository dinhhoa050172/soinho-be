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
import { OrderAlreadyExistsError } from '../../domain/order.error';
import { OrderResponseDto } from '../../dtos/order.response.dto';
import { OrderMapper } from '../../mappers/order.mapper';
import { CreateOrderCommand } from './create-order.command';
import { CreateOrderRequestDto } from './create-order.request.dto';
import { CreateOrderServiceResult } from './create-order.service';
import { PaymentMapper } from 'src/modules/user/payment/mappers/payment.mapper';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}`)
@Controller(routesV1.version)
export class CreateOrderHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: OrderMapper,
    private readonly paymentMapper: PaymentMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Order' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard)
  @Post(routesV1.user.order.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    const command = new CreateOrderCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateOrderServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (orderWithPayment) => {
        const { order, payment } = orderWithPayment;
        return {
          ...this.mapper.toResponse(order),
          payment: this.paymentMapper.toResponse(payment),
        };
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
