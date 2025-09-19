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
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { TransactionNotFoundError } from '../../domain/transaction.error';
import { TransactionResponseDto } from '../../dtos/transaction.response.dto';
import {
  FindTransactionByUserQuery,
  FindTransactionByUserQueryResult,
} from './find-transaction-by-user.query-handler';
import { FindTransactionByUserRequestDto } from './find-transaction-by-user.request.dto';
@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.TRANSACTION}`)
@Controller(routesV1.version)
export class FindTransactionByUserHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: TransactionMapper,
  ) {}

  @ApiOperation({ summary: 'Find transaction' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: TransactionNotFoundError.message,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard)
  @Get(routesV1.user.transaction.getByUser)
  async findProduct(
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
    queryParams: FindTransactionByUserRequestDto,
  ): Promise<TransactionPaginatedResponseDto> {
    const query = new FindTransactionByUserQuery(
      queryParams.findOptions,
      user.email,
    );
    const result: FindTransactionByUserQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();
    return new TransactionPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
