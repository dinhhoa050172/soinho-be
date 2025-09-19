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
import { CreateProductImageCommand } from './create-product-image.command';
import { CreateProductImageRequestDto } from './create-product-image.request.dto';
import { CreateProductImageServiceResult } from './create-product-image.service';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { ProductImageEntity } from '../../domain/product-image.entity';
import { ProductImageResponseDto } from '../../dtos/product-image.response.dto';
import { ProductImageMapper } from '../../mappers/product-image.mapper';
import { ProductImageAlreadyExistsError } from '../../domain/product-image.error';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT_IMAGE}`,
)
@Controller(routesV1.version)
export class CreateProductImageHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ProductImageMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Product' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ProductImageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post(routesV1.productCatalog.productImage.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateProductImageRequestDto,
  ): Promise<ProductImageResponseDto> {
    const command = new CreateProductImageCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateProductImageServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (Product: ProductImageEntity) => this.mapper.toResponse(Product),
      Err: (error: Error) => {
        if (error instanceof ProductImageAlreadyExistsError) {
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
