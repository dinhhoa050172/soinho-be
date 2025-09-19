/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, HttpStatus, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { DirectFilterPipe } from '@chax-at/prisma-filter';
import {
  FindPaymentMethodsQuery,
  FindPaymentMethodsQueryResult,
} from './find-payment-methods.query-handler';
import { FindPaymentMethodsRequestDto } from './find-payment-methods.request.dto';
import { PaymentMethodScalarFieldEnum } from '../../database/payment-method.repository.prisma';
import { PaymentMethodPaginatedResponseDto } from '../../dtos/payment-method.paginated.response.dto';
import { PaymentMethodMapper } from '../../mappers/payment-method.mapper';

@ApiTags(`${API_V1_TAGS.PAYMENT_METHOD}`)
@Controller(routesV1.version)
export class FindPaymentMethodsHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: PaymentMethodMapper,
  ) {}

  @ApiOperation({ summary: 'Find PaymentMethods' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaymentMethodPaginatedResponseDto,
  })
  @Get(routesV1.paymentMethod.root)
  async findPaymentMethods(
    @Query(
      new DirectFilterPipe<any, Prisma.PaymentMethodWhereInput>([
        PaymentMethodScalarFieldEnum.id,
      ]),
    )
    queryParams: FindPaymentMethodsRequestDto,
  ): Promise<PaymentMethodPaginatedResponseDto> {
    const query = new FindPaymentMethodsQuery(queryParams.findOptions);
    const result: FindPaymentMethodsQueryResult =
      await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new PaymentMethodPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map(this.mapper.toResponse),
    });
  }
}
