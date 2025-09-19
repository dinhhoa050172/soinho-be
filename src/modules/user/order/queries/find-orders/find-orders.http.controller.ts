/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, HttpStatus, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { OrderPaginatedResponseDto } from '../../dtos/order.paginated.response.dto';
import { OrderMapper } from '../../mappers/order.mapper';
import { OrderScalarFieldEnum } from '../../database/order.repository.prisma';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  FindOrdersQuery,
  FindOrdersQueryResult,
} from './find-orders.query-handler';
import { FindOrdersRequestDto } from './find-orders.request.dto';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}`)
@Controller(routesV1.version)
export class FindOrdersHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: OrderMapper,
  ) {}

  @ApiOperation({ summary: 'Find Orders' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrderPaginatedResponseDto,
  })
  @Get(routesV1.user.order.root)
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  async findOrders(
    @Query(
      new DirectFilterPipe<any, Prisma.OrderWhereInput>([
        OrderScalarFieldEnum.id,
      ]),
    )
    queryParams: FindOrdersRequestDto,
  ): Promise<OrderPaginatedResponseDto> {
    const query = new FindOrdersQuery(queryParams.findOptions);
    const result: FindOrdersQueryResult = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new OrderPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
