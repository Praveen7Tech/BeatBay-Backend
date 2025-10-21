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

  async update(key: string, newOtp: Partial<CachedData>): Promise<void> {
    const cachedData = await this.get(key)
    if(!cachedData) throw new Error("cache not found")

    const updatedData = {
      ...cachedData,
      ...newOtp
    };

    await this.set(key,updatedData,300)
  }

  async storeResetToken(key: string, value:string, expirationInSeconds: number){
    await this.client.setEx(key, expirationInSeconds, value)
  }

  async getResetToken(key: string): Promise<string | null>{
    const cacheVal = await this.client.get(key)

    if(!cacheVal) return null
     return cacheVal
  }

}
