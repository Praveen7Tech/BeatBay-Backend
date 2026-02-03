import { ArtistDetailsResponseDTO } from "../../../application/dto/artist/artist.profile.dto";
import { IArtistDetailsUseCase } from "../../../application/interfaces/usecase/artist-features/artist-details-usecase.interface";
import { ArtistDetailsMapper } from "../../../application/mappers/artist/profile/artist.profile.mapper";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

export class ArtistDetailsUseCase implements IArtistDetailsUseCase{
    constructor(
        private readonly _mongooseArtistRepository: IArtistRepository,
        private readonly _awsStorageService: IAWSS3StorageService
    ){}

    async execute(artistId:string): Promise<ArtistDetailsResponseDTO  | null>{
        const artist = await this._mongooseArtistRepository.findArtistDetailsById(artistId);

        if (!artist) return null;
       const songsWithUrls = await Promise.all(
            (artist.songs || []).map(async (song) => {
                const coverUrl = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey);
                return { ...song, coverImageUrl: coverUrl };
            })
        );

        const updatedArtist = { ...artist, songs: songsWithUrls };

        return ArtistDetailsMapper.toResponse(updatedArtist);
    }
}