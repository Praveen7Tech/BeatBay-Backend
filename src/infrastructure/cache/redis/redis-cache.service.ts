import { getRedisClient } from "../../config/redis";
import { ICacheService } from "../../../domain/services/cache.service";

export class RedisCacheServive implements ICacheService {
  private client = getRedisClient();

  async set(key: string, value: string, expirationInSeconds: number): Promise<void> {
    await this.client.setEx(key, expirationInSeconds, value);
  }

  async get(key: string): Promise<string | null> {
    const cacheval = await this.client.get(key);
    if(cacheval){
      const {otp} = JSON.parse(cacheval)
      console.log("key-",otp)
      return otp
    }
    return cacheval
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
