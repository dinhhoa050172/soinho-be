import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteOrderItemCommand } from './delete-order-item.command';
import { DeleteOrderItemServiceResult } from './delete-order-item.service';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { match } from 'oxide.ts';
import { OrderItemNotFoundError } from '../../domain/order-item.error';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.ORDER.root}_${API_V1_TAGS.USER.ORDER.ORDER_ITEM}`,
)
@Controller(routesV1.version)
export class DeleteOrderItemHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Delete a OrderItem' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'OrderItem ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'OrderItem deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: OrderItemNotFoundError.message,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Delete(routesV1.user.order.orderItem.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') orderItemId: bigint): Promise<void> {
    const command = new DeleteOrderItemCommand({ orderItemId });
    const result: DeleteOrderItemServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof OrderItemNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
