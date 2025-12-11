import { ArtistDetails, Song } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { SongResponseDTO } from "../../dto/song/song.response.dto";

function isArtistDetails(artist: string | ArtistDetails): artist is ArtistDetails {
    return typeof artist !== 'string' && artist !== null && typeof artist === 'object' && '_id' in artist;
}

export class SongDetailsUseCase {
    constructor(
        private readonly _mongooseSongRepository: ISongRepository,
        private readonly _recomentationService: IRecomentationService
    ){}

    async execute(songId: string): Promise<SongResponseDTO>{

       const songDetails = await this._mongooseSongRepository.findById(songId)
        
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
            songId,artistIdString,genre
        )


        return {songs: songDetails, recomentations: recomentations}
    }
}