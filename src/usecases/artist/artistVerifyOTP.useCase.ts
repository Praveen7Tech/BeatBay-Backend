// src/usecases/artist/artistVerifyOTP.useCase.ts
import { InvalidOtpError, OtpExpiredError } from "../../common/errors/user.auth.error";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ICacheService } from "../../domain/services/cache.service";
import { IPasswordService } from "../../domain/services/password.service";
import { VerifyOtpRequestDTO } from "../dto/auth/request.dto";
import { IArtistRepository } from "../../domain/repositories/artist.repository";
import { Artist } from "../../domain/entities/arist.entity"; 
import { ITransactionManager } from "../../domain/services/transaction.service";

export class ArtistVerifyOTPuseCase {
    constructor(
        private readonly cacheService: ICacheService,
        private readonly passwordService: IPasswordService,
        private readonly userRepository: IUserRepository,
        private readonly artistRepository: IArtistRepository,
        private readonly transactionManager: ITransactionManager
    ){}

    async execute(request: VerifyOtpRequestDTO): Promise<void> {
        const cacheKey = `artist_otp:${request.email}`;
        const cachedData = await this.cacheService.get(cacheKey);
        
        if (!cachedData) throw new OtpExpiredError();
    
        const { name, email, password, otp, otpExpiredAt } = cachedData;
        
        if (Date.now() > otpExpiredAt) throw new OtpExpiredError();
        if (otp !== request.otp) throw new InvalidOtpError();
    
        const passwordHash = await this.passwordService.hash(password);

        await this.transactionManager.withTransaction(async(session)=>{
            console.log("Creating user and artist profiles inside the transaction...")
            const newUser = await this.userRepository.create({
                name, 
                email,
                password: passwordHash,
                googleId: null, 
                profilePicture: null,
                role:"artist",
            }, session);

            await this.artistRepository.create({
                userId: newUser._id,
                bio: '',
                albums: [],
                songs: [],
            } as Artist);
        });
    
         console.log("Transaction for artist account creation committed.");
        await this.cacheService.delete(cacheKey);
    }
}
