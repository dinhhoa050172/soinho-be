/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, HttpStatus, Get, UseGuards, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { routesV1 } from 'src/configs/app.route';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { PaymentMapper } from '../../mappers/payment.mapper';
import {
  FindPaymentsByOrderQuery,
  FindPaymentsByOrderQueryResult,
} from './find-payments-by-order.query-handler';
import { PaymentResponseDto } from '../../dtos/payment.response.dto';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.PAYMENT}`)
@Controller(routesV1.version)
export class FindPaymentsByOrderHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: PaymentMapper,
  ) {}

  @ApiOperation({ summary: 'Find Payments by user' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'orderId',
    required: true,
    type: String,
    description: 'ID of the payment to find payments for',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Array<PaymentResponseDto>,
  })
  @Get(routesV1.user.payment.getByOrder)
  @UseGuards(AuthJwtGuard)
  async findPaymentsByPayment(
    @Param('orderId') orderId: bigint,
  ): Promise<PaymentResponseDto[]> {
    const query = new FindPaymentsByOrderQuery(orderId);
    const result: FindPaymentsByOrderQueryResult =
      await this.queryBus.execute(query);

    const listData = result.unwrap();

    return listData.map(this.mapper.toResponse);
  }
}
