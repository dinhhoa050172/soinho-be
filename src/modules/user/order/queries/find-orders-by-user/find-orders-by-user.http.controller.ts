/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, HttpStatus, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { OrderPaginatedResponseDto } from '../../dtos/order.paginated.response.dto';
import { OrderMapper } from '../../mappers/order.mapper';
import { OrderScalarFieldEnum } from '../../database/order.repository.prisma';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  FindOrdersByUserQuery,
  FindOrdersByUserQueryResult,
} from './find-orders-by-user.query-handler';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { FindOrdersByUserRequestDto } from './find-orders-by-user.request.dto';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}`)
@Controller(routesV1.version)
export class FindOrdersByUserHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: OrderMapper,
  ) {}

  @ApiOperation({ summary: 'Find Orders by user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderPaginatedResponseDto,
  })
  @Get(routesV1.user.order.getByUser)
  @UseGuards(AuthJwtGuard)
  async findOrdersByUser(
    @ReqUser() user: RequestUser,
    @Query(
      new DirectFilterPipe<any, Prisma.OrderWhereInput>([
        OrderScalarFieldEnum.id,
      ]),
    )
    queryParams: FindOrdersByUserRequestDto,
  ): Promise<OrderPaginatedResponseDto> {
    const query = new FindOrdersByUserQuery({
      ...queryParams.findOptions,
      userId: BigInt(user.id),
    });
    const result: FindOrdersByUserQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new OrderPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
