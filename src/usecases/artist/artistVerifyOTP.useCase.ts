
import { ICacheService } from "../../domain/services/cache.service";
import { IPasswordService } from "../../domain/services/password.service";
import { VerifyOtpRequestDTO } from "../dto/auth/request.dto";
import { IArtistRepository } from "../../domain/repositories/artist.repository";
import { InvalidOtpError, OtpExpiredError } from "../../common/errors/common/common.errors";

export class ArtistVerifyOTPuseCase {
    constructor(
        private readonly cacheService: ICacheService,
        private readonly passwordService: IPasswordService,
        private readonly artistRepository: IArtistRepository,
    ){}

    async execute(request: VerifyOtpRequestDTO): Promise<void> {
        const cacheKey = `artist_otp:${request.email}`;
        const cachedData = await this.cacheService.get(cacheKey);
        
        if (!cachedData) throw new OtpExpiredError();
    
        const { name, email, password, otp, otpExpiredAt } = cachedData;
        
        if (Date.now() > otpExpiredAt) throw new OtpExpiredError();
        if (otp !== request.otp) throw new InvalidOtpError();
    
        const passwordHash = await this.passwordService.hash(password);

        await this.artistRepository.create({
            name:name,email:email,password:passwordHash,googleId:null,role:"artist"
        })
    
        await this.cacheService.delete(cacheKey);
    }
}
