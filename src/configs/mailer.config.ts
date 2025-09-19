import { get } from 'env-var';

export const mailerConfig = {
  host: get('SMTP_HOST').asString(),
  port: get('SMTP_PORT').asInt(),
  user: get('SMTP_USER').asString(),
  pass: get('SMTP_PASS').asString(),
  verificationUrl: get('VERIFICATION_URL').required().asString(),
};
