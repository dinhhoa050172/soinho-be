export interface PaymentGatewayPort {
  createPaymentLink(
    orderCode: number,
    amount: number,
    desc: string,
  ): Promise<string>;
  verifyWebhook(body: any): boolean;
  getInfo(orderCode: number | string): Promise<any>;
  cancel(orderCode: number | string, reason?: string): Promise<any>;
}
