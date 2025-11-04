import { NotFoundError } from "../../common/errors/common/common.errors";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { IPasswordService } from "../../domain/services/password.service";
import { EditProfileRequestDTO, EditProfileResponseDTO } from "../dto/profile/profile.dto";

export class ArtistEditProfileUsecase{
    constructor(
        private readonly passwordService: IPasswordService,
        private readonly userReposistory: IUserRepository,
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
        if(!updatedUser) throw new NotFoundError("Artist not found for edit")

        return {user:updatedUser}
    }        
}