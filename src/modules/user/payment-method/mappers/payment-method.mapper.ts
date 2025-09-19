import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { PaymentMethod as PaymentMethodModel } from '@prisma/client';
import { PaymentMethodEntity } from '../domain/payment-method.entity';
import { PaymentMethodResponseDto } from '../dtos/payment-method.response.dto';

@Injectable()
export class PaymentMethodMapper
  implements
    Mapper<PaymentMethodEntity, PaymentMethodModel, PaymentMethodResponseDto>
{
  toPersistence(entity: PaymentMethodEntity): PaymentMethodModel {
    const copy = entity.getProps();
    const record: PaymentMethodModel = {
      id: copy.id,
      // Map entity properties to record
      name: copy.name,
      description: copy.description || null,
      isActive: copy.isActive,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: PaymentMethodModel): PaymentMethodEntity {
    return new PaymentMethodEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        name: record.name,
        description: record.description || null,
        isActive: record.isActive,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: PaymentMethodEntity): PaymentMethodResponseDto {
    const props = entity.getProps();
    const response = new PaymentMethodResponseDto(props);
    response.name = props.name;
    response.description = props.description;
    response.isActive = props.isActive;
    return response;
  }
}
