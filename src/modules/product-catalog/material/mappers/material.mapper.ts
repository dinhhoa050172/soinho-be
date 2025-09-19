import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/libs/ddd';
import { Material as MaterialModel } from '@prisma/client';
import { MaterialEntity } from '../domain/material.entity';
import { MaterialResponseDto } from '../dtos/material.response.dto';

@Injectable()
export class MaterialMapper
  implements Mapper<MaterialEntity, MaterialModel, MaterialResponseDto>
{
  toPersistence(entity: MaterialEntity): MaterialModel {
    const copy = entity.getProps();
    const record: MaterialModel = {
      id: copy.id,
      // Map entity properties to record
      name: copy.name,
      unit: copy.unit,
      stockQty: copy.stockQty,
      thresholdQty: copy.thresholdQty || 10,
      price: copy.price || null,
      color: copy.color || null,
      description: copy.description || null,
      isActive: copy.isActive || false,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(record: MaterialModel): MaterialEntity {
    return new MaterialEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        name: record.name,
        unit: record.unit,
        stockQty: record.stockQty,
        thresholdQty: record.thresholdQty,
        price: record.price || null,
        color: record.color || null,
        description: record.description || null,
        isActive: record.isActive || false,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: MaterialEntity): MaterialResponseDto {
    const props = entity.getProps();
    const response = new MaterialResponseDto(props);
    response.name = props.name;
    response.unit = props.unit;
    response.stockQty = props.stockQty;
    response.thresholdQty = props.thresholdQty || 0;
    response.price = props.price || null;
    response.color = props.color || null;
    response.description = props.description || null;
    response.isActive = props.isActive;
    return response;
  }
}
