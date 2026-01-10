import { ArtistDetails, Song } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { SongResponseDTO } from "../../../application/dto/song/song.response.dto";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ISongDetailsUseCase } from "../../../application/interfaces/usecase/song/song-details-usecaase.interface";

function isArtistDetails(artist: string | ArtistDetails): artist is ArtistDetails {
    return typeof artist !== 'string' && artist !== null && typeof artist === 'object' && '_id' in artist;
}

export class SongDetailsUseCase implements ISongDetailsUseCase{
    constructor(
        private readonly _mongooseSongRepository: ISongRepository,
        private readonly _recomentationService: IRecomentationService
    ){}

    async execute(songId: string, userId: string): Promise<SongResponseDTO>{

        const { song: songDetails, isLiked } = await this._mongooseSongRepository.findById(songId, userId!)
       
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

        const recomentations = await this._recomentationService.getRecomentedSongs(
            songId,artistIdString,genre, userId
        )

        return {
            songs: songDetails, 
            isLiked: isLiked,
            recomentations: recomentations
        }
    }
}