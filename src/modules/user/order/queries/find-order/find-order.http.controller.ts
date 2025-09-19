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
import { OrderNotFoundError } from '../../domain/order.error';
import { OrderResponseDto } from '../../dtos/order.response.dto';
import { OrderMapper } from '../../mappers/order.mapper';
import {
  FindOrderQuery,
  FindOrderQueryResult,
} from './find-order.query-handler';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}`)
@Controller(routesV1.version)
export class FindOrderHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: OrderMapper,
  ) {}

  @ApiOperation({ summary: 'Find one Order' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OrderNotFoundError.message,
    type: ApiErrorResponse,
  })
  @Get(routesV1.user.order.getOne)
  async findProduct(@Param('id') orderId: bigint): Promise<OrderResponseDto> {
    const query = new FindOrderQuery(orderId);
    const result: FindOrderQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (order) => this.mapper.toResponse(order),
      Err: (error: Error) => {
        if (error instanceof OrderNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
