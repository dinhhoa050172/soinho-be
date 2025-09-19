import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { Address as AddressModel } from '@prisma/client';
import { User as UserModel } from '@prisma/client';
import { AddressEntity } from '../domain/address.entity';
import { AddressResponseDto } from '../dtos/address.response.dto';
import { UserEntity } from 'src/modules/sa/user/domain/user.entity';

@Injectable()
export class AddressMapper
  implements Mapper<AddressEntity, AddressModel, AddressResponseDto>
{
  toPersistence(entity: AddressEntity): AddressModel {
    const copy = entity.getProps();
    const record: AddressModel = {
      id: copy.id,
      // Map entity properties to record
      userId: copy.userId,
      fullName: copy.fullName,
      phone: copy.phone || null,
      street: copy.street,
      ward: copy.ward || null,
      district: copy.district || null,
      province: copy.province || null,
      country: copy.country,
      postalCode: copy.postalCode || null,
      isDefault: copy.isDefault || false,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(
    record: AddressModel & {
      user?: UserModel;
    },
  ): AddressEntity {
    return new AddressEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        userId: record.userId,
        fullName: record.fullName,
        phone: record.phone,
        street: record.street,
        ward: record.ward,
        district: record.district,
        province: record.province,
        country: record.country,
        postalCode: record.postalCode,
        isDefault: record.isDefault,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        user: record.user
          ? new UserEntity({
              id: record.user.id,
              createdAt: record.user.createdAt,
              updatedAt: record.user.updatedAt,
              props: {
                // Map record.user properties to entity
                firstName: record.user.firstName,
                lastName: record.user.lastName,
                email: record.user.email,
                password: record.user.password,
                phone: record.user.phone,
                isActive: record.user.isActive,
                emailVerified: record.user.emailVerified,
                roleName: record.user.roleName,
                createdBy: record.user.createdBy,
                updatedBy: record.user.updatedBy,
              },
            })
          : undefined,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: AddressEntity): AddressResponseDto {
    const props = entity.getProps();
    const response = new AddressResponseDto(props);
    response.userId = props.userId.toString();
    response.fullName = props.fullName ?? null;
    response.phone = props.phone ?? null;
    response.street = props.street ?? null;
    response.ward = props.ward ?? null;
    response.district = props.district ?? null;
    response.province = props.province ?? null;
    response.country = props.country ?? null;
    response.postalCode = props.postalCode ?? null;
    response.isDefault = props.isDefault ?? null;
    return response;
  }
}
