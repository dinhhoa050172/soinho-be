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
import { CategoryEntity } from '../../domain/category.entity';
import { CategoryAlreadyExistsError } from '../../domain/category.error';
import { CategoryResponseDto } from '../../dtos/category.response.dto';
import { CategoryMapper } from '../../mappers/category.mapper';
import { CreateCategoryCommand } from './create-category.command';
import { CreateCategoryRequestDto } from './create-category.request.dto';
import { CreateCategoryServiceResult } from './create-category.service';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.CATEGORY}`,
)
@Controller(routesV1.version)
export class CreateCategoryHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: CategoryMapper,
  ) {}

  @ApiOperation({ summary: 'Create a Category' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Post(routesV1.productCatalog.category.root)
  async create(
    @ReqUser() user: RequestUser,
    @Body() body: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const command = new CreateCategoryCommand({
      ...body,
      createdBy: user.email,
    });

    const result: CreateCategoryServiceResult =
      await this.commandBus.execute(command);

    return match(result, {
      Ok: (user: CategoryEntity) => this.mapper.toResponse(user),
      Err: (error: Error) => {
        if (error instanceof CategoryAlreadyExistsError) {
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
