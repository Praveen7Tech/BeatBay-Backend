
import { User } from "../../../domain/entities/user.entity" 
import { IUserRepository } from "../../../domain/repositories/user.repository" 
import { NotFoundError } from "../../../common/errors/common/common.errors" 
import { EditProfileRequestDTO, EditProfileResponseDTO } from "../../dto/profile/profile.dto"

export class editProfileUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
    ){}

    async execute(userId: string,request:EditProfileRequestDTO): Promise<EditProfileResponseDTO>{
        const {name, profileImage} = request

        const updateData : Partial<User> = {}
        if(name !== undefined) updateData.name = name;
        if(profileImage !== undefined) updateData.profilePicture = profileImage;

        const updatedUser = await this.userRepository.update(userId,updateData)
        if(!updatedUser) throw new NotFoundError("user not found for update")


        return {user:updatedUser}
    }
}