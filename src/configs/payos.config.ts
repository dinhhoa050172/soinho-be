import { get } from 'env-var';

export const payosConfig = {
  clientId: get('PAYOS_CLIENT_ID').asString() ?? 'demo',
  apiKey: get('PAYOS_API_KEY').asString() ?? 'demo',
  checksumKey: get('PAYOS_CHECKSUM_KEY').asString() ?? 'demo',
  returnUrl: get('PAYOS_RETURN_URL').asString() ?? 'https://www.soinho.shop/',
  cancelUrl: get('PAYOS_CANCEL_URL').asString() ?? 'https://www.soinho.shop/',
};
