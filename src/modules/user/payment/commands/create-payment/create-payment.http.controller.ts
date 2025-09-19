import { match } from 'oxide.ts';
import {
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { PaymentEntity } from '../../domain/payment.entity';
import { PaymentAlreadyExistsError } from '../../domain/payment.error';
import { PaymentResponseDto } from '../../dtos/payment.response.dto';
import { PaymentMapper } from '../../mappers/payment.mapper';
import { CreatePaymentCommand } from './create-payment.command';
import { CreatePaymentServiceResult } from './create-payment.service';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { CreatePaymentRequestDto } from './create-payment.request.dto';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.PAYMENT}`)
@Controller(routesV1.version)
export class CreatePaymentHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: PaymentMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Payment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'orderId',
    description: 'The ID of the order to create a payment for',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post(routesV1.user.payment.createWithOrder)
  async create(
    @ReqUser() user: RequestUser,
    @Param('orderId') orderId: bigint,
    @Body() body: CreatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const command = new CreatePaymentCommand({
      orderId,
      ...body,
      createdBy: user.email,
    });

    const result: CreatePaymentServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (user: PaymentEntity) => this.mapper.toResponse(user),
      Err: (error: Error) => {
        if (error instanceof PaymentAlreadyExistsError) {
          throw new ConflictHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        throw error;
      },
    });
  }
}
