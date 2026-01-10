import { NotFoundError } from "../../../common/errors/common/common.errors";
import { Artist } from "../../../domain/entities/arist.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { EditProfileRequestDTO, EditProfileResponseDTO } from "../../../application/dto/profile/profile.dto";
import { IArtistEditProfileUsecase } from "../../../application/interfaces/usecase/artist-features/edit-profile-usecase.interface";

export class ArtistEditProfileUsecase implements IArtistEditProfileUsecase{
    constructor(
        private readonly _artistRepository: IArtistRepository,
    ){}

    async execute(userId: string,request:EditProfileRequestDTO): Promise<EditProfileResponseDTO>{
        const {name,bio, profileImage, profileImagePublicId} = request

        const updateData : Partial<Artist> = {}
        if(name !== undefined) updateData.name = name;
        if(profileImage !== undefined) updateData.profilePicture = profileImage;
        if(bio !== undefined) updateData.bio = bio
        if(profileImagePublicId) updateData.profileImagePublicId = profileImagePublicId

        const updatedArtist = await this._artistRepository.update(userId,updateData)
        if(!updatedArtist) throw new NotFoundError("Artist not found for edit")

        return {user:updatedArtist}
    }        
}