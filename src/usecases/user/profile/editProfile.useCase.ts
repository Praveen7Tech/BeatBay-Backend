
import { User } from "../../../domain/entities/user.entity" 
import { IUserRepository } from "../../../domain/repositories/user.repository" 
import { NotFoundError } from "../../../common/errors/common/common.errors" 
import { EditProfileRequestDTO, EditProfileResponseDTO } from "../../../application/dto/profile/profile.dto"
import { IEditProfileUseCase } from "../../../application/interfaces/usecase/user-features/edit-profile-usecase.interface"

export class editProfileUsecase implements IEditProfileUseCase{
    constructor(
        private readonly _userRepository: IUserRepository,
    ){}

    async execute(userId: string,request:EditProfileRequestDTO): Promise<EditProfileResponseDTO>{
        const {name, profileImage, profileImagePublicId} = request

        const updateData : Partial<User> = {}
        if(name !== undefined) updateData.name = name;
        if(profileImage !== undefined) updateData.profilePicture = profileImage;
        if(profileImagePublicId) updateData.profileImagePublicId = profileImagePublicId

        const updatedUser = await this._userRepository.update(userId,updateData)
        if(!updatedUser) throw new NotFoundError("user not found for update")


        return {user:updatedUser}
    }
}