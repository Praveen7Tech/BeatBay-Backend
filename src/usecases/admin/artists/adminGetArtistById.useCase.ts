import { ArtistProfileDTO } from "../../../application/dto/admin/artist/artist.profile.dto"
import { IGetArtistByIdUseCase } from "../../../application/interfaces/usecase/artist-features/get-artist-byid-usecase.interface"
import { ArtistProfileMapper, EnrichedSong } from "../../../application/mappers/admin/artist/artist.profile.mapper"
import { Album } from "../../../domain/entities/album.entity"
import { Artist } from "../../../domain/entities/arist.entity"
import { SongNew } from "../../../domain/entities/song.entity"
import { IArtistRepository } from "../../../domain/repositories/artist.repository"
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service"

export class GetArtistByIdUseCase implements IGetArtistByIdUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository,
         private readonly _awsStorageService: IAWSS3StorageService
    ){}
    
    async execute(artistId: string): Promise<ArtistProfileDTO>{
    
        const artist = await this._artistRepository.findById(artistId);
        if (!artist) throw new Error("Artist not found");

        const populatedSongs = artist.songs as unknown as SongNew[];
        const album = artist.albums as unknown as Album[];

        const songWithUrl: EnrichedSong[] = await Promise.all(
            populatedSongs.map(async (song) => ({
                ...song,
                signedCoverUrl: await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey),
            }))
        );


        return ArtistProfileMapper.toDTO(artist, songWithUrl, album);
    }
}