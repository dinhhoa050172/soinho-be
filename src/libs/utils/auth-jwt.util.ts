import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { jwtConfig } from 'src/configs/jwt.config';

@Injectable()
export class HashService {
  private readonly saltRounds = 6;

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(`${password}${jwtConfig.secretKey}`, this.saltRounds);
  }

  verifyPassword(password: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(`${password}${jwtConfig.secretKey}`, storedPassword);
  }

  generateAccessToken(user: object): string {
    return jwt.sign(user, jwtConfig.accessSecret, {
      expiresIn: '24h',
    });
  }

  generateRefreshToken(user: object): string {
    return jwt.sign(user, jwtConfig.refreshSecret, {
      expiresIn: '7d',
    });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, jwtConfig.accessSecret);
  }

  verifyRefreshToken(refreshToken: string): any {
    return jwt.verify(refreshToken, jwtConfig.refreshSecret);
  }

  generateEmailToken(email: object): string {
    return jwt.sign(email, jwtConfig.emailSecret, {
      expiresIn: '24h',
    });
  }

  verifyEmailToken(emailToken: string): any {
    return jwt.verify(emailToken, jwtConfig.emailSecret);
  }
}
