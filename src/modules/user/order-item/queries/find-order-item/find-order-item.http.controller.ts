import { match } from 'oxide.ts';
import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { OrderItemNotFoundError } from '../../domain/order-item.error';
import { OrderItemResponseDto } from '../../dtos/order-item.response.dto';
import { OrderItemMapper } from '../../mappers/order-item.mapper';
import {
  FindOrderItemQuery,
  FindOrderItemQueryResult,
} from './find-order-item.query-handler';

@ApiTags(
  `${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}_${API_V1_TAGS.USER.ORDER.ORDER_ITEM}`,
)
@Controller(routesV1.version)
export class FindOrderItemHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: OrderItemMapper,
  ) {}

  @ApiOperation({ summary: 'Find one OrderItem' })
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
  @Get(routesV1.user.order.orderItem.getOne)
  async findProduct(
    @Param('id') orderItemId: bigint,
  ): Promise<OrderItemResponseDto> {
    const query = new FindOrderItemQuery(orderItemId);
    const result: FindOrderItemQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (orderItem) => this.mapper.toResponse(orderItem),
      Err: (error: Error) => {
        if (error instanceof OrderItemNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
