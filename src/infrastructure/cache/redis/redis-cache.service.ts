import { getRedisClient } from "../../config/redis";
import { CachedData, ICacheService } from "../../../domain/services/cache.service";

export class RedisCacheServive implements ICacheService {
  private client = getRedisClient();

  async set(key: string, value: CachedData, expirationInSeconds: number): Promise<void> {
    await this.client.setEx(key, expirationInSeconds,JSON.stringify(value));
  }

  async get(key: string): Promise<CachedData | null> {
    const cacheval = await this.client.get(key);
    
    if(!cacheval) return null

    return JSON.parse(cacheval) as CachedData
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
