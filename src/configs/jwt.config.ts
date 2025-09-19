import { get } from 'env-var';

export const jwtConfig = {
  secretKey: get('SECRET_KEY').default('').asString(),
  accessSecret: get('ACCESS_SECRET').default('').asString(),
  refreshSecret: get('REFRESH_SECRET').default('').asString(),
  emailSecret: get('EMAIL_SECRET').default('').asString(),
  expiresIn: get('EXPIRES_ACCESSTOKEN').default('24h').required().asString(),
  refreshExpiresIn: get('EXPIRES_REFRESHTOKEN')
    .default('24h')
    .required()
    .asString(),
};
