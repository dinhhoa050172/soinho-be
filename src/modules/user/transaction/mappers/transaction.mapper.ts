import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../domain/transaction.entity';
import {
  Transaction as TransactionModel,
  User as UserModel,
} from '@prisma/client';
import { UserEntity } from 'src/modules/sa/user/domain/user.entity';
import { TransactionResponseDto } from '../dtos/transaction.response.dto';
import { Mapper } from 'src/libs/ddd';

@Injectable()
export class TransactionMapper
  implements Mapper<TransactionEntity, TransactionModel, TransactionResponseDto>
{
  toPersistence(entity: TransactionEntity): TransactionModel {
    const copy = entity.getProps();
    const record: TransactionModel = {
      id: copy.id,
      // Map entity properties to record
      userId: copy.userId,
      orderId: copy.orderId,
      productId: copy.productId,
      quantity: copy.quantity,
      totalPrice: copy.totalPrice,
      status: copy.status,
      createdAt: copy.createdAt,
      createdBy: copy.createdBy,
      updatedAt: copy.updatedAt,
      updatedBy: copy.updatedBy || null,
    };

    return record;
  }

  toDomain(
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    record: TransactionModel & {
      users?: UserModel;
    },
  ): TransactionEntity {
    return new TransactionEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        // Map record properties to entity
        orderId: record.orderId,
        userId: record.userId,
        productId: record.productId,
        quantity: record.quantity,
        totalPrice: record.totalPrice,
        status: record.status,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
        user: record.users
          ? new UserEntity({
              id: record.users.id,
              createdAt: record.users.createdAt,
              updatedAt: record.users.updatedAt,
              props: {
                // Map record.user properties to entity
                firstName: record.users.firstName,
                lastName: record.users.lastName,
                email: record.users.email,
                password: record.users.password,
                phone: record.users.phone,
                isActive: record.users.isActive,
                emailVerified: record.users.emailVerified,
                roleName: record.users.roleName,
                createdBy: record.users.createdBy,
                updatedBy: record.users.updatedBy,
              },
            })
          : undefined,
      },
      skipValidation: true,
    });
  }

  toResponse(entity: TransactionEntity): TransactionResponseDto {
    const props = entity.getProps();
    const response = new TransactionResponseDto(props);
    response.userId = props.userId.toString();
    response.orderId = props.orderId.toString();
    response.productId = props.productId.toString();
    response.quantity = props.quantity;
    response.totalPrice = props.totalPrice.toString();
    response.status = props.status;
    return response;
  }
}
