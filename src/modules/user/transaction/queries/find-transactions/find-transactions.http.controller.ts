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
import { TransactionPaginatedResponseDto } from '../../dtos/transaction.paginated.response.dto';
import { TransactionMapper } from '../../mappers/transaction.mapper';
import { TransactionScalarFieldEnum } from '../../database/transaction.repository.prisma';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import {
  FindTransactionsQuery,
  FindTransactionsQueryResult,
} from './find-transactions.query-handler';
import { FindTransactionsRequestDto } from './find-transactions.request.dto';
@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.TRANSACTION}`)
@Controller(routesV1.version)
export class FindTransactionsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: TransactionMapper,
  ) {}

  @ApiOperation({ summary: 'Find Transactions' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TransactionPaginatedResponseDto,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get(routesV1.user.transaction.root)
  async findTransactions(
    @ReqUser() user: RequestUser,
    @Query(
      new DirectFilterPipe<any, Prisma.TransactionWhereInput>([
        TransactionScalarFieldEnum.userId,
        TransactionScalarFieldEnum.productId,
        TransactionScalarFieldEnum.quantity,
        TransactionScalarFieldEnum.totalPrice,
        TransactionScalarFieldEnum.status,
      ]),
    )
    queryParams: FindTransactionsRequestDto,
  ): Promise<TransactionPaginatedResponseDto> {
    const query = new FindTransactionsQuery(
      queryParams.findOptions,
      user.email,
    );
    const result: FindTransactionsQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new TransactionPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
