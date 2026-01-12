import { ArtistDetails, Song } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { SongHydrationResponseDTO } from "../../../application/dto/song/song.response.dto";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ISongHydrationUseCase } from "../../../application/interfaces/usecase/song/song-hydration-useace.interface";

function isArtistDetails(artist: string | ArtistDetails): artist is ArtistDetails {
    return typeof artist !== 'string' && artist !== null && typeof artist === 'object' && '_id' in artist;
}

export class SongHydrationUseCase implements ISongHydrationUseCase{
    constructor(
        private readonly _mongooseSongRepository: ISongRepository,
        private readonly _recommendationService: IRecomentationService
    ){}

    async execute(songId: string): Promise<SongHydrationResponseDTO>{

       const songDetails = await this._mongooseSongRepository.songHydration(songId)
       
       if(!songDetails){
          throw new NotFoundError("Song currently un available !")
       }
        
       const artistId = songDetails?.artistId
       const genre = songDetails?.genre

        let artistIdString: string | undefined

        if (artistId) {
            if (isArtistDetails(artistId)) {
                artistIdString = artistId._id; 
            } else {
                artistIdString = artistId;
            }
        }
        if(!artistIdString || !genre){
            throw new Error("song recomentation logic failed")
        }

        const recomentations = await this._recommendationService.getRecomentedSongs(
            songId,artistIdString,genre
        )


        return [songDetails];
    }
}