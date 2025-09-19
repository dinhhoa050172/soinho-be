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
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { ProductCustomEntity } from '../../domain/product-custom.entity';
import { ProductCustomAlreadyExistsError } from '../../domain/product-custom.error';
import { ProductCustomResponseDto } from '../../dtos/product-custom.response.dto';
import { ProductCustomMapper } from '../../mappers/product-custom.mapper';
import { CreateProductCustomCommand } from './create-product-custom.command';
import { CreateProductCustomRequestDto } from './create-product-custom.request.dto';
import { CreateProductCustomServiceResult } from './create-product-custom.service';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.PRODUCT_CUSTOM}`,
)
@Controller(routesV1.version)
export class CreateProductCustomHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: ProductCustomMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Product custom' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ProductCustomResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CUSTOMER, Role.DESIGNER)
  @Post(routesV1.productCatalog.productCustom.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateProductCustomRequestDto,
  ): Promise<ProductCustomResponseDto> {
    const command = new CreateProductCustomCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateProductCustomServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (Product: ProductCustomEntity) => this.mapper.toResponse(Product),
      Err: (error: Error) => {
        if (error instanceof ProductCustomAlreadyExistsError) {
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
