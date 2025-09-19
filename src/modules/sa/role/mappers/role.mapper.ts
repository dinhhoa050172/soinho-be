import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { Role as RoleModel } from '@prisma/client';
import { RoleEntity } from '../domain/role.entity';
import { RoleResponseDto } from '../dtos/role.response.dto';

@Injectable()
export class RoleMapper
  implements Mapper<RoleEntity, RoleModel, RoleResponseDto>
{
  toPersistence(entity: RoleEntity): RoleModel {
    const copy = entity.getProps();
    const record: RoleModel = {
      id: copy.id,
      roleName: copy.roleName,
      roleDesc: copy.roleDesc || null,
      isActive: copy.isActive,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };
    return record;
  }

  toDomain(record: RoleModel): RoleEntity {
    return new RoleEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        roleName: record.roleName,
        roleDesc: record.roleDesc,
        isActive: record.isActive,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: RoleEntity): RoleResponseDto {
    const props = entity.getProps();
    const response = new RoleResponseDto(props);
    response.roleName = props.roleName;
    response.roleDesc = props.roleDesc;
    response.isActive = props.isActive;
    return response;
  }
}
