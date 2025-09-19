/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { OrderItemPaginatedResponseDto } from '../../dtos/order-item.paginated.response.dto';
import { OrderItemMapper } from '../../mappers/order-item.mapper';
import { OrderItemScalarFieldEnum } from '../../database/order-item.repository.prisma';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  FindOrderItemsQuery,
  FindOrderItemsQueryResult,
} from './find-order-items.query-handler';
import { FindOrderItemsRequestDto } from './find-order-items.request.dto';

@ApiTags(
  `${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}_${API_V1_TAGS.USER.ORDER.ORDER_ITEM}`,
)
@Controller(routesV1.version)
export class FindOrderItemsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: OrderItemMapper,
  ) {}

  @ApiOperation({ summary: 'Find OrderItems' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderItemPaginatedResponseDto,
  })
  @Get(routesV1.user.order.orderItem.root)
  async findOrderItems(
    @Query(
      new DirectFilterPipe<any, Prisma.OrderItemWhereInput>([
        OrderItemScalarFieldEnum.id,
      ]),
    )
    queryParams: FindOrderItemsRequestDto,
  ): Promise<OrderItemPaginatedResponseDto> {
    const query = new FindOrderItemsQuery(queryParams.findOptions);
    const result: FindOrderItemsQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new OrderItemPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
