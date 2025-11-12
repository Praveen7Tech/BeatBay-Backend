import { NotFoundError } from "../../common/errors/common/common.errors";
import { Artist } from "../../domain/entities/arist.entity";
import { IArtistRepository } from "../../domain/repositories/artist.repository";
import { IPasswordService } from "../../domain/services/password.service";
import { EditProfileRequestDTO, EditProfileResponseDTO } from "../dto/profile/profile.dto";

export class ArtistEditProfileUsecase{
    constructor(
        private readonly artistRepository: IArtistRepository,
    ){}

    async execute(userId: string,request:EditProfileRequestDTO): Promise<EditProfileResponseDTO>{
        const {name,bio, profileImage} = request

        const updateData : Partial<Artist> = {}
        if(name !== undefined) updateData.name = name;
        if(profileImage !== undefined) updateData.profilePicture = profileImage;
        if(bio !== undefined) updateData.bio = bio

        const updatedUser = await this.artistRepository.update(userId,updateData)
        if(!updatedUser) throw new NotFoundError("Artist not found for edit")

        return {user:updatedUser}
    }        
}