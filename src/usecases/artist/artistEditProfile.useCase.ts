import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { IPasswordService } from "../../domain/services/password.service";
import { ITokenService } from "../../domain/services/token.service";
import { EditProfileRequest } from "../auth/dto/request.dto";
import { authStatusResponseDTO } from "../auth/dto/response.dto";

export class ArtistEditProfileUsecase{
    constructor(
        private readonly passwordService: IPasswordService,
        private readonly userReposistory: IUserRepository,
        private readonly tokenService: ITokenService
    ){}

    async execute(userId: string,request:EditProfileRequest): Promise<authStatusResponseDTO>{
        const {name, password, profileImage} = request

        const updateData : Partial<User> = {}
        if(name !== undefined) updateData.name = name;
        if(profileImage !== undefined) updateData.profilePicture = profileImage;

        if(password){
            const hashedPassword = await this.passwordService.hash(password)
            updateData.password = hashedPassword
        }

        const updatedUser = await this.userReposistory.update(userId,updateData)
        if(!updatedUser) throw new Error("user not found for update")

        const payloadTkn = { id: updatedUser._id, email: updatedUser.email };
        const newAccessToken = await this.tokenService.generateAccessToken(payloadTkn);
        const newRefreshToken = await this.tokenService.generateRefressToken(payloadTkn)

        return {user:updatedUser, accessToken:newAccessToken, refreshToken:newRefreshToken}
    }        
}