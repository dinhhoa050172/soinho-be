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
import { DeleteCategoryCommand } from './delete-category.command';
import { DeleteCategoryServiceResult } from './delete-category.service';
import { AuthJwtGuard } from 'src/modules/auth/guards/auth.guard';
import { routesV1 } from 'src/configs/app.route';
import { ApiErrorResponse } from 'src/libs/api/api-error.response';
import { API_V1_TAGS } from 'src/libs/constants/swagger-tag';
import { match } from 'oxide.ts';
import { CategoryNotFoundError } from '../../domain/category.error';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/modules/auth/domain/role.type';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@ApiTags(
  `${API_V1_TAGS.PRODUCT_CATALOG.root} - ${API_V1_TAGS.PRODUCT_CATALOG.CATEGORY}`,
)
@Controller(routesV1.version)
export class DeleteCategoryHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Delete a Category' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: 'string',
    required: true,
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CategoryNotFoundError.message,
    type: ApiErrorResponse,
  })
  @UseGuards(AuthJwtGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Delete(routesV1.productCatalog.category.delete)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') categoryId: bigint): Promise<void> {
    const command = new DeleteCategoryCommand({ categoryId });
    const result: DeleteCategoryServiceResult =
      await this.commandBus.execute(command);

    match(result, {
      Ok: (isOk: boolean) => isOk,
      Err: (error: Error) => {
        if (error instanceof CategoryNotFoundError) {
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
