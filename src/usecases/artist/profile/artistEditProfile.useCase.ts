import { NotFoundError } from "../../../common/errors/common/common.errors";
import { Artist } from "../../../domain/entities/arist.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { EditProfileRequestDTO } from "../../../application/dto/profile/profile.dto";
import { IArtistEditProfileUsecase, UploadFile } from "../../../application/interfaces/usecase/artist-features/edit-profile-usecase.interface";
import { ICloudinaryStorageService } from "../../../domain/services/cloudinary.storage.service";
import {  ProfileResponse } from "../../../application/dto/artist/artist.profile.dto";
import { AuthMapper } from "../../../application/mappers/user/auth/auth.mapper";

export class ArtistEditProfileUsecase implements IArtistEditProfileUsecase{
    constructor(
        private readonly _artistRepository: IArtistRepository,
        private readonly _storageServiceRepository: ICloudinaryStorageService
    ){}

    async execute(artistId: string,request:EditProfileRequestDTO,file?:UploadFile): Promise<ProfileResponse>{

        const existArtist = await this._artistRepository.findById(artistId)
        if (!existArtist) throw new NotFoundError("Artist not found");

        const updateData: Partial<Artist> ={
            name: request.name,
            bio: request.bio
        }

        if (file) {
            const folder = `artist_profile/${artistId}`;
            const upload = await this._storageServiceRepository.uploadImage(file.buffer, file.mimeType, {
                folder,
                publicId: existArtist.profileImagePublicId!
            });
            updateData.profilePicture = upload.url;
            updateData.profileImagePublicId = upload.publicId;
        }

        const updatedArtist = await this._artistRepository.update(artistId, updateData);
        if (!updatedArtist) throw new NotFoundError("Update failed");

        return AuthMapper.toAuthArtistDTO(updatedArtist)
       
    }        
}