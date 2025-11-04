import { email } from "zod";
import { User } from "../../domain/entities/user.entity";
import { IPasswordService } from "../../domain/services/password.service";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ITokenService } from "../../domain/services/token.service";
import { EditProfileRequestDTO, EditProfileResponseDTO } from "../dto/profile/profile.dto";

export class editProfileUsecase {
    constructor(
        private readonly passwordService: IPasswordService,
        private readonly userReposistory: IUserRepository,
        private readonly tokenService: ITokenService
    ){}

    async execute(userId: string,request:EditProfileRequestDTO): Promise<EditProfileResponseDTO>{
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


        return {user:updatedUser}
    }
}