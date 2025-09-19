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
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { match } from 'oxide.ts';
import { CartNotFoundError } from '../../domain/cart.error';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { ClearCartCommand } from './clear-cart.command';
import { ClearCartServiceResult } from './clear-cart.service';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.CART}`)
@Controller(routesV1.version)
export class ClearCardHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Clear cart' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Cart ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Cart has been cleared',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CartNotFoundError.message,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Delete(routesV1.user.cart.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') cartId: bigint): Promise<void> {
    const command = new ClearCartCommand({ cartId });
    const result: ClearCartServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof CartNotFoundError) {
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
