
export interface CachedData {
    name: string,
    email: string,
    otp: string,
    otpExpiredAt: number,
    password: string
}



export interface ICacheService {
    set(key: string, value: CachedData, expirationInSeconds: number): Promise<void>
    get(key: string): Promise<CachedData | null>
    delete(key: string): Promise<void>
    update(key: string, newOtp: Partial<CachedData>): Promise<void>
    storeResetToken(key: string, value:string, expirationInSeconds:number): Promise<void>
    getResetToken(key: string): Promise<string | null>
}