import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
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
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { match } from 'oxide.ts';
import { CartNotFoundError } from '../../domain/cart.error';
import { RemoveItemFromCartCommand } from './remove-item-from-cart.command';
import { RemoveItemFromCartRequestDto } from './remove-item-from-cart.request.dto';
import { RemoveItemFromCartServiceResult } from './remove-item-from-cart.service';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.CART}`)
@Controller(routesV1.version)
export class RemoveItemFromCartHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Cart removed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CartNotFoundError.message,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard)
  @Delete(routesV1.user.cart.root)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Body() body: RemoveItemFromCartRequestDto): Promise<void> {
    const command = new RemoveItemFromCartCommand({ ...body });
    const result: RemoveItemFromCartServiceResult =
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
