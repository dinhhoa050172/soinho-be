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
import { CreateProductCommand } from './create-product.command';
import { CreateProductRequestDto } from './create-product.request.dto';
import { CreateProductServiceResult } from './create-product.service';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { ReqUser } from 'src/libs/decorators/request-user.decorator';
import { RequestUser } from 'src/modules/auth/domain/value-objects/request-user.value-object';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { ProductEntity } from '../../domain/product.entity';
import { ProductAlreadyExistsError } from '../../domain/product.error';
import { ProductResponseDto } from '../../dtos/product.response.dto';
import { ProductMapper } from '../../mappers/product.mapper';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT}`,
)
@Controller(routesV1.version)
export class CreateProductHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ProductMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Product' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post(routesV1.productCatalog.product.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const command = new CreateProductCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateProductServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (Product: ProductEntity) => this.mapper.toResponse(Product),
      Err: (error: Error) => {
        if (error instanceof ProductAlreadyExistsError) {
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
