import { match } from 'oxide.ts';

import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  NotFoundException as NotFoundHttpException,
  Param,
  Put,
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
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { UpdateProductCustomStatusRequestDto } from './update-product-custom-status.request.dto';
import { UpdateProductCustomStatusServiceResult } from './update-product-custom-status.service';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { ProductCustomMapper } from '../../mappers/product-custom.mapper';
import { ProductCustomEntity } from '../../domain/product-custom.entity';
import {
  ProductCustomNotFoundError,
  ProductCustomAlreadyInUseError,
} from '../../domain/product-custom.error';
import { ProductCustomResponseDto } from '../../dtos/product-custom.response.dto';
import { UpdateProductCustomStatusCommand } from './update-product-custom-status.command';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT_CUSTOM}`,
)
@Controller(routesV1.version)
export class UpdateProductCustomStatusHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ProductCustomMapper,
  ) {}

  @ApiOperation({ summary: 'Update Product custom status' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Product custom ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductCustomResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ProductCustomNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.DESIGNER)
  @Put(routesV1.productCatalog.productCustom.updateProductCustomStatus)
  async updateStatus(
    @ReqUser() user: RequestUser,
    @Param('id') productCustomId: bigint,
    @Body() body: UpdateProductCustomStatusRequestDto,
  ): Promise<ProductCustomResponseDto> {
    const command = new UpdateProductCustomStatusCommand({
      productCustomId,
      ...body,
      updatedBy: user.email,
    });

    const result: UpdateProductCustomStatusServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (product: ProductCustomEntity) => this.mapper.toResponse(product),
      Err: (error: Error) => {
        if (error instanceof ProductCustomNotFoundError) {
          throw new NotFoundHttpException({
            message: error.message,
            errorCode: error.code,
          });
        }
        if (error instanceof ProductCustomAlreadyInUseError) {
          throw new ConflictException({
            message: error.message,
            errorCode: error.code,
          });
        }

        throw error;
      },
    });
  }
}
