import { match } from 'oxide.ts';
import {
  ConflictException as ConflictHttpException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { PaymentMethodResponseDto } from '../../dtos/payment-method.response.dto';
import { PaymentMethodMapper } from '../../mappers/payment-method.mapper';
import { PaymentMethodAlreadyExistsError } from '../../domain/payment-method.error';
import { CreatePaymentMethodCommand } from './create-payment-method.command';
import { CreatePaymentMethodRequestDto } from './create-payment-method.request.dto';
import { CreatePaymentMethodServiceResult } from './create-payment-method.service';
import { PaymentMethodEntity } from '../../domain/payment-method.entity';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';

@ApiTags(`${API_V1_TAGS.PAYMENT_METHOD}`)
@Controller(routesV1.version)
export class CreatePaymentMethodHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: PaymentMethodMapper,
  ) {}

  @ApiOperation({ summary: 'Create a PaymentMethod' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post(routesV1.paymentMethod.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreatePaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto> {
    const command = new CreatePaymentMethodCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreatePaymentMethodServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (paymentMethod: PaymentMethodEntity) =>
        this.mapper.toResponse(paymentMethod),
      Err: (error: Error) => {
        if (error instanceof PaymentMethodAlreadyExistsError) {
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
