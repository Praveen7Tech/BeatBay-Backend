import { ArtistDetailsResponseDTO } from "../../../application/dto/artist/artist.profile.dto";
import { IArtistDetailsUseCase } from "../../../application/interfaces/usecase/artist-features/artist-details-usecase.interface";
import { ArtistDetailsMapper } from "../../../application/mappers/artist/profile/artist.profile.mapper";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class ArtistDetailsUseCase implements IArtistDetailsUseCase{
    constructor(
        private readonly _mongooseArtistRepository: IArtistRepository
    ){}

    async execute(artistId:string): Promise<ArtistDetailsResponseDTO  | null>{
        const artist = await this._mongooseArtistRepository.findArtistDetailsById(artistId);

        if (!artist) return null;

        return ArtistDetailsMapper.toResponse(artist);
    }
}