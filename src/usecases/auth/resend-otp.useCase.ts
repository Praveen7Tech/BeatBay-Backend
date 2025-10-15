import { MESSAGES } from "../../common/constants.message";
import { StatusCode } from "../../common/status.enum";
import { ICacheService } from "../../domain/services/cache.service";

interface ResendOtpRequest {
    name : string,
    email : string,
    password : string
}

export class ResendOtpUseCase {
    constructor(
        private readonly cacheService : ICacheService
    ){}

    async execute(request: ResendOtpRequest) : Promise<{status :  StatusCode ; message: string; otp?: string}>{

        const cacheKey = `otp:${request.email}`
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpirationInSeconds = 300
        const name = request.name, email = request.email, password = request.password
        const cachedData = {name,email,password,otp}
        console.log("resend data-",cachedData)
        
        await this.cacheService.set(cacheKey,JSON.stringify(cachedData), otpExpirationInSeconds)

        return {
            status: StatusCode.OK,
            message: MESSAGES.OTP_SEND
        }
    }
}