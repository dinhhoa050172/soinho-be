import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { User as UserModel } from '@prisma/client';
import { UserProfileEntity } from '../domain/user-profile.entity';
import { UserProfileResponseDto } from '../dtos/user-profile.response.dto';

@Injectable()
export class UserProfileMapper
  implements Mapper<UserProfileEntity, UserModel, UserProfileResponseDto>
{
  toPersistence(entity: UserProfileEntity): UserModel {
    const copy = entity.getProps();
    const record: UserModel = {
      id: copy.id,
      // Map entity properties to record
      firstName: copy.firstName || null,
      lastName: copy.lastName || null,
      email: copy.email,
      password: copy.password,
      phone: copy.phone || null,
      isActive: copy.isActive || false,
      emailVerified: copy.emailVerified || false,
      roleName: copy.roleName,
      avatarUrl: copy.avatarUrl || null,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: UserModel): UserProfileEntity {
    return new UserProfileEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        password: record.password,
        phone: record.phone,
        isActive: record.isActive,
        emailVerified: record.emailVerified,
        avatarUrl: record.avatarUrl || null,
        roleName: record.roleName,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: UserProfileEntity): UserProfileResponseDto {
    const props = entity.getProps();
    const response = new UserProfileResponseDto(props);
    response.firstName = props.firstName;
    response.lastName = props.lastName;
    response.email = props.email;
    response.phone = props.phone;
    response.roleName = props.roleName;
    response.isActive = props.isActive;
    response.emailVerified = props.emailVerified;
    response.avatarUrl = props.avatarUrl || null;
    return response;
  }
}
