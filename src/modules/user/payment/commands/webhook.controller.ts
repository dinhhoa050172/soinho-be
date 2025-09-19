// payos.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { routesV1 } from 'src/configs/app.route';
import { payosConfig } from 'src/configs/payos.config';
import { UpdatePaymentServiceResult } from './update-payment/update-payment.service';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePaymentCommand } from './update-payment/update-payment.command';
import { UpdateTransactionServiceResult } from '../../transaction/commands/update-transaction/update-transaction.service';
import { UpdateTransactionCommand } from '../../transaction/commands/update-transaction/update-transaction.command';
import { UpdateOrderCommand } from '../../order/commands/update-order/update-order.command';

@Controller(routesV1.version)
export class PayOSController {
  private readonly secretKey = payosConfig.checksumKey;

  constructor(
    private readonly commandBus: CommandBus,
    // private readonly mapper: PaymentMapper,
  ) {}

  @Post('/payos/webhook')
  async handleWebhook(@Body() body: any) {
    console.log('Webhook PayOS received:', body);

    const signature = body?.signature;

    if (isValidData(body.data, signature, this.secretKey) === false) {
      throw new HttpException('Invalid signature', 403);
    }

    const status = String(body.data.status || '').toUpperCase();

    const orderCode = body.data.orderCode;
    try {
      switch (status) {
        case 'PAID': {
          console.log(`Payment successful for order: ${orderCode}`);
          const paidPayment: UpdatePaymentServiceResult =
            await this.commandBus.execute(
              new UpdatePaymentCommand({
                orderId: BigInt(orderCode as string),
                status: 'SUCCESSED',
                updatedBy: 'payos-webhook',
              }),
            );
          if (paidPayment.isErr()) {
            throw new HttpException(
              paidPayment.unwrapErr(),
              HttpStatus.BAD_REQUEST,
            );
          }

          const paidOrder: UpdatePaymentServiceResult =
            await this.commandBus.execute(
              new UpdateOrderCommand({
                orderId: BigInt(orderCode as string),
                status: 'COMPLETED',
                updatedBy: 'payos-webhook',
              }),
            );
          if (paidOrder.isErr()) {
            throw new HttpException(
              paidOrder.unwrapErr(),
              HttpStatus.BAD_REQUEST,
            );
          }

          const updatedTransaction: UpdateTransactionServiceResult =
            await this.commandBus.execute(
              new UpdateTransactionCommand({
                orderId: BigInt(orderCode as string),
                status: 'COMPLETED',
                updatedBy: 'payos-webhook',
              }),
            );
          if (updatedTransaction.isErr()) {
            throw new HttpException(
              updatedTransaction.unwrapErr(),
              HttpStatus.BAD_REQUEST,
            );
          }
          break;
        }

        case 'CANCELLED': {
          console.log(`Payment cancelled for order: ${orderCode}`);
          const cancelledPayment: UpdatePaymentServiceResult =
            await this.commandBus.execute(
              new UpdatePaymentCommand({
                orderId: BigInt(orderCode as string),
                status: 'CANCELLED',
                updatedBy: 'payos-webhook',
              }),
            );
          if (cancelledPayment.isErr()) {
            throw new HttpException(
              cancelledPayment.unwrapErr(),
              HttpStatus.BAD_REQUEST,
            );
          }

          const paidOrder: UpdatePaymentServiceResult =
            await this.commandBus.execute(
              new UpdateOrderCommand({
                orderId: BigInt(orderCode as string),
                status: 'CANCELLED',
                updatedBy: 'payos-webhook',
              }),
            );
          if (paidOrder.isErr()) {
            throw new HttpException(
              paidOrder.unwrapErr(),
              HttpStatus.BAD_REQUEST,
            );
          }

          const updatedTransaction: UpdateTransactionServiceResult =
            await this.commandBus.execute(
              new UpdateTransactionCommand({
                orderId: BigInt(orderCode as string),
                status: 'CANCELLED',
                updatedBy: 'payos-webhook',
              }),
            );
          if (updatedTransaction.isErr()) {
            throw new HttpException(
              updatedTransaction.unwrapErr(),
              HttpStatus.BAD_REQUEST,
            );
          }
          break;
        }

        case 'FAILED': {
          console.log(`Payment failed for order: ${orderCode}`);
          const failedPayment: UpdatePaymentServiceResult =
            await this.commandBus.execute(
              new UpdatePaymentCommand({
                orderId: BigInt(orderCode as string),
                status: 'FAILED',
                updatedBy: 'payos-webhook',
              }),
            );
          if (failedPayment.isErr()) {
            throw new HttpException(
              failedPayment.unwrapErr(),
              HttpStatus.BAD_REQUEST,
            );
          }
          break;
        }

        case 'EXPIRED': {
          console.log(`Payment expired for order: ${orderCode}`);
          const expiredPayment: UpdatePaymentServiceResult =
            await this.commandBus.execute(
              new UpdatePaymentCommand({
                orderId: BigInt(orderCode as string),
                status: 'FAILED',
                updatedBy: 'payos-webhook',
              }),
            );
          if (expiredPayment.isErr()) {
            throw new HttpException(
              expiredPayment.unwrapErr(),
              HttpStatus.BAD_REQUEST,
            );
          }
          break;
        }

        default:
          console.warn(
            `Webhook PayOS: Unknown status: ${status} for order: ${orderCode}`,
          );
          // Không throw error để tránh PayOS retry webhook
          break;
      }

      return {
        message: 'Webhook received successfully',
        orderCode,
        status: status.toLowerCase(),
      };
    } catch (error) {
      console.error(`Error processing webhook for order ${orderCode}:`, error);
      throw new HttpException(
        `Failed to process webhook: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

function sortObjDataByKey(object) {
  const orderedObject = Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  return orderedObject;
}

function convertObjToQueryStr(object) {
  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .map((key) => {
      let value = object[key];
      // Sort nested object
      if (value && Array.isArray(value)) {
        value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
      }
      // Set empty string if null
      if ([null, undefined, 'undefined', 'null'].includes(value)) {
        value = '';
      }

      return `${key}=${value}`;
    })
    .join('&');
}

function isValidData(data, currentSignature, checksumKey): boolean {
  const sortedDataByKey = sortObjDataByKey(data);
  const dataQueryStr = convertObjToQueryStr(sortedDataByKey);
  const dataToSignature = createHmac('sha256', checksumKey)
    .update(dataQueryStr)
    .digest('hex');
  return dataToSignature === currentSignature;
}
