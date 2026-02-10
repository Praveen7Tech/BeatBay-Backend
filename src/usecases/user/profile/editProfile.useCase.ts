
import { User } from "../../../domain/entities/user.entity" 
import { IUserRepository } from "../../../domain/repositories/user.repository" 
import { NotFoundError } from "../../../common/errors/common/common.errors" 
import { EditProfileRequestDTO } from "../../../application/dto/profile/profile.dto"
import { IEditProfileUseCase } from "../../../application/interfaces/usecase/user-features/edit-profile-usecase.interface"
import { ICloudinaryStorageService } from "../../../domain/services/cloudinary.storage.service"
import { UploadFile } from "../../../application/interfaces/usecase/artist-features/edit-profile-usecase.interface"
import { AuthMapper } from "../../../application/mappers/user/auth/auth.mapper"
import { ProfileResponse } from "../../../application/dto/artist/artist.profile.dto"

export class EditProfileUsecase implements IEditProfileUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _storageServiceRepository: ICloudinaryStorageService
    ) {}

    async execute(userId: string, request: EditProfileRequestDTO, file?: UploadFile): Promise<ProfileResponse> {
        const existingUser = await this._userRepository.findById(userId);
        if (!existingUser) throw new NotFoundError("User not found");

        const updateData: Partial<User> = {
            name: request.name,
        };

        if (file) {
            const folder = `user_profile/${userId}`;
            const upload = await this._storageServiceRepository.uploadImage(file.buffer, file.mimeType, {
                folder,
                publicId: existingUser.profileImagePublicId!
            });
            updateData.profilePicture = upload.url;
            updateData.profileImagePublicId = upload.publicId;
        }

        const updatedUser = await this._userRepository.update(userId, updateData);
        if (!updatedUser) throw new NotFoundError("Update failed");

        return AuthMapper.toAuthUserDTO(updatedUser)
    }
}
