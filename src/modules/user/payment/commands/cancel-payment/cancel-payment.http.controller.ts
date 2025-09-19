import { match } from 'oxide.ts';
import {
  ConflictException as ConflictHttpException,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Param,
  Body,
  Res,
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
import { PaymentAlreadyExistsError } from '../../domain/payment.error';
import { PaymentMapper } from '../../mappers/payment.mapper';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { CancelPaymentRequestDto } from './cancel-payment.request.dto';
import { CancelPaymentServiceResult } from './cancel-payment.service';
import { CancelPaymentCommand } from './cancel-payment.command';
import { Response } from 'express';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.PAYMENT}`)
@Controller(routesV1.version)
export class CancelPaymentHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: PaymentMapper,
  ) {}

  @ApiOperation({ summary: 'Update a Payment' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The ID of the order',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Payment cancelled successfully, redirecting to homepage',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post(routesV1.user.payment.cancel)
  async create(
    @ReqUser() user: RequestUser,
    @Param('id') orderId: bigint,
    @Body() body: CancelPaymentRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const command = new CancelPaymentCommand({
      orderId,
      ...body,
      updatedBy: user.email,
    });

    const result: CancelPaymentServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: () => {
        // Redirect to homepage on success
        res.redirect(`https://www.soinho.shop/`);
      },
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
