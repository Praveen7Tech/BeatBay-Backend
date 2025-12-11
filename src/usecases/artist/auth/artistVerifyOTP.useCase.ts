
import { ICacheService } from "../../../domain/services/cache.service";
import { IPasswordService } from "../../../domain/services/password.service";
import { VerifyOtpRequestDTO } from "../../dto/auth/request.dto";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { InvalidOtpError, OtpExpiredError } from "../../../common/errors/common/common.errors";

export class ArtistVerifyOTPuseCase {
    constructor(
        private readonly _cacheService: ICacheService,
        private readonly _passwordService: IPasswordService,
        private readonly _artistRepository: IArtistRepository,
    ){}

    async execute(request: VerifyOtpRequestDTO): Promise<void> {
        const cacheKey = `artist_otp:${request.email}`;
        const cachedData = await this._cacheService.get(cacheKey);
        
        if (!cachedData) throw new OtpExpiredError();
    
        const { name, email, password, otp, otpExpiredAt } = cachedData;
        
        if (Date.now() > otpExpiredAt) throw new OtpExpiredError();
        if (otp !== request.otp) throw new InvalidOtpError();
    
        const passwordHash = await this._passwordService.hash(password);

        await this._artistRepository.create({
            name:name,email:email,password:passwordHash,googleId:null,role:"artist",bio:null
        })
    
        await this._cacheService.delete(cacheKey);
    }
}
