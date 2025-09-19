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
import { AddItemToCartCommand } from './add-item-to-cart.command';
import { AddItemToCartRequestDto } from './add-item-to-cart.request.dto';
import { AddItemToCartServiceResult } from './add-item-to-cart.service';
import { CartEntity } from '../../domain/cart.entity';
import { CartAlreadyExistsError } from '../../domain/cart.error';
import { CartResponseDto } from '../../dtos/cart.response.dto';
import { CartMapper } from '../../mappers/cart.mapper';

@ApiTags(`${API_V1_TAGS.USER.root} - ${API_V1_TAGS.USER.CART}`)
@Controller(routesV1.version)
export class AddItemToCartHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: CartMapper,
  ) {}

  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CartResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard)
  @Post(routesV1.user.cart.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: AddItemToCartRequestDto,
  ): Promise<CartResponseDto> {
    const command = new AddItemToCartCommand({
      ...body,
      createdBy: user.email,
    });

    const result: AddItemToCartServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (cart: CartEntity) => this.mapper.toResponse(cart),
      Err: (error: Error) => {
        if (error instanceof CartAlreadyExistsError) {
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
