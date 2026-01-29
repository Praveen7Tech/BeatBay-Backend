
import { ICacheService } from "../../../domain/services/cache.service";
import { IPasswordService } from "../../../domain/services/password.service";
import { VerifyOtpRequestDTO } from "../../../application/dto/auth/request.dto";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { InvalidOtpError, OtpExpiredError } from "../../../common/errors/common/common.errors";
import { IArtistVerifyOTPuseCase } from "../../../application/interfaces/usecase/artist/artist-verify-otp-usecase.interface";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class ArtistVerifyOTPuseCase implements IArtistVerifyOTPuseCase{
    constructor(
        private readonly _cacheService: ICacheService,
        private readonly _passwordService: IPasswordService,
        private readonly _artistRepository: IArtistRepository,
        private readonly _stripeService: IStripeService
    ){}

    async execute(request: VerifyOtpRequestDTO): Promise<void> {
        const cacheKey = `artist_otp:${request.email}`;
        const cachedData = await this._cacheService.get(cacheKey);
        
        if (!cachedData) throw new OtpExpiredError();
    
        const { name, email, password, otp, otpExpiredAt } = cachedData;
        
        if (Date.now() > otpExpiredAt) throw new OtpExpiredError();
        if (otp !== request.otp) throw new InvalidOtpError();
    
        const passwordHash = await this._passwordService.hash(password);

        // create stripe connect account
        const ConnectAccount = await this._stripeService.createConnectAccount()

        await this._artistRepository.create({
            name:name,email:email,password:passwordHash,googleId:null,role:"artist",bio:null,stripeConnectId:ConnectAccount.id
        })

        await this._cacheService.delete(cacheKey);
    }
}
