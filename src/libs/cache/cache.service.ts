import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheOptions } from './interfaces/cache-options.interface';
import { CACHE_MODULE_OPTIONS } from './cache.module-definition';
import { TIME } from '../constants/constanst';

@Injectable()
export class CacheService implements OnModuleInit {
  private _redis: Redis;

  constructor(@Inject(CACHE_MODULE_OPTIONS) private _options: CacheOptions) {
    // this._redis = new Redis({
    //   host: this._options.host,
    //   port: this._options.port,
    //   password: this._options.password,
    //   family: this._options.family || 4,
    //   tls: this._options.tls,
    //   connectTimeout: this._options.connectTimeout || 3000,
    //   retryStrategy:
    //     this._options.retryStrategy || ((times) => Math.min(times * 50, 2000)),
    // });

    // connect by url
    this._redis = new Redis(this._options.url);

    this._redis.on('connect', () => {
      console.log('Redis connected');
    });
    this._redis.on('error', (error) => {
      console.error('Redis error: ', error);
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this._redis.ping();
    } catch (error) {
      console.error('Unable to connect to Redis:', error);
      throw new Error('Unable to connect to Redis');
    }
  }

  public async ping(): Promise<string | null> {
    return this._redis.ping();
  }

  public async get(key: string): Promise<string | null> {
    return this._redis.get(key);
  }

  async getSession(email: string, sessionState: string): Promise<any | null> {
    const key = `session:${email}:${sessionState}`;
    return this._redis.get(key);
  }

  async setSession(email: string, sessionState: string): Promise<void> {
    this._redis.set(`session:${email}:${sessionState}`, sessionState);
  }

  async delSession(email: string, sessionState: string): Promise<void> {
    this._redis.del(`session:${email}:${sessionState}`, sessionState);
  }

  async delAllSession(email: string): Promise<void> {
    const sid = await this._redis.keys(`session:${email}:*`);
    sid?.length &&
      sid.forEach(async (key) => {
        await this._redis.del(key);
      });
  }

  public async set(
    key: string,
    value: string,
    ttl = TIME.DAY * 7,
  ): Promise<void> {
    await this._redis.set(key, value, 'PX', ttl);
  }

  public async hget(key: string, field: string): Promise<string | null> {
    return this._redis.hget(key, field);
  }

  public async hset(
    key: string,
    field: string,
    value: string,
  ): Promise<number> {
    return this._redis.hset(key, field, value);
  }

  public async hdel(key: string, fields: string[]): Promise<void> {
    fields.forEach(async (field) => {
      await this._redis.hdel(key, field);
    });
  }

  public async del(key: string): Promise<number> {
    return this._redis.del(key);
  }

  public async delMany(keys: string[]): Promise<void> {
    // avoid ERR CROSSSLOT with cluster mode
    keys.forEach(async (key) => {
      await this._redis.del(key);
    });
  }

  public async delPattern(pattern: string): Promise<void> {
    const keys = await this._redis.keys(pattern);
    keys?.length &&
      keys.forEach(async (key) => {
        await this._redis.del(key);
      });
  }

  public async delAll(): Promise<'OK'> {
    return this._redis.flushdb();
  }

  /** SET commands */
  public async ttl(key: string): Promise<number> {
    return this._redis.ttl(key);
  }

  public async sadd(key: string, value: string): Promise<number> {
    return this._redis.sadd(key, value);
  }

  public async scard(key: string): Promise<number> {
    return this._redis.scard(key);
  }

  public async smembers(key: string): Promise<string[]> {
    return this._redis.smembers(key);
  }

  public async srem(key: string, value: string): Promise<number> {
    return this._redis.srem(key, value);
  }

  public async incr(key: string): Promise<number> {
    return this._redis.incr(key);
  }

  public async expire(key: string, expireSeconds: number): Promise<number> {
    return this._redis.expire(key, expireSeconds);
  }
}
