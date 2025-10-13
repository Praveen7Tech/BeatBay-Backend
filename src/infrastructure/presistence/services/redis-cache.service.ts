import { getRedisClient } from "../../config/redis";
import { ICatcheService } from "../../../domain/services/cache.service";

export class RedisCacheServive implements ICatcheService {
  private client = getRedisClient();

  async set(key: string, value: string, expirationInSeconds: number): Promise<void> {
    await this.client.setEx(key, expirationInSeconds, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
