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
import { PaymentNotFoundError } from '../../domain/payment.error';
import { PaymentResponseDto } from '../../dtos/payment.response.dto';
import { PaymentMapper } from '../../mappers/payment.mapper';
import {
  FindPaymentQuery,
  FindPaymentQueryResult,
} from './find-payment.query-handler';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.PAYMENT}`)
@Controller(routesV1.version)
export class FindPaymentHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: PaymentMapper,
  ) {}

  @ApiOperation({ summary: 'Find one Payment' })
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: PaymentNotFoundError.message,
    type: ApiErrorResponse,
  })
  @Get(routesV1.user.payment.getOne)
  async findPayment(
    @Param('id') paymentId: bigint,
  ): Promise<PaymentResponseDto> {
    const query = new FindPaymentQuery(paymentId);
    const result: FindPaymentQueryResult = await this.queryBus.execute(query);

    return match(result, {
      Ok: (payment) => this.mapper.toResponse(payment),
      Err: (error: Error) => {
        if (error instanceof PaymentNotFoundError) {
          throw new NotFoundHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
