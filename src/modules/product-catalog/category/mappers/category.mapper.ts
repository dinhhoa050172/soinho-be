import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { Category as CategoryModel } from '@prisma/client';
import { CategoryEntity } from '../domain/category.entity';
import { CategoryResponseDto } from '../dtos/category.response.dto';

@Injectable()
export class CategoryMapper
  implements Mapper<CategoryEntity, CategoryModel, CategoryResponseDto>
{
  toPersistence(entity: CategoryEntity): CategoryModel {
    const copy = entity.getProps();
    const record: CategoryModel = {
      id: copy.id,
      slug: copy.slug,
      name: copy.name,
      desc: copy.desc || null,
      isActive: copy.isActive || false,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: CategoryModel): CategoryEntity {
    return new CategoryEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        slug: record.slug,
        name: record.name,
        desc: record.desc,
        isActive: record.isActive,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: CategoryEntity): CategoryResponseDto {
    const props = entity.getProps();
    const response = new CategoryResponseDto(props);
    response.slug = props.slug;
    response.name = props.name;
    response.desc = props.desc;
    response.isActive = props.isActive;
    return response;
  }
}
