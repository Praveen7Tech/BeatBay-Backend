import { duration } from "zod/v4/classic/iso.cjs";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { UploadSongDTO } from "../../dto/song/song.dto";

export class UploadSongUseCase {
    constructor(
        private readonly songRepository: ISongRepository,
        private readonly artistRepository: IArtistRepository,
        private readonly transactionManager: ITransactionManager
    ){}

    async execute(artistId:string,request: UploadSongDTO): Promise<{success: boolean}>{

        await this.transactionManager.withTransaction(async(session)=>{
            
            const songData = {
                title: request.title,
                description:request.description,
                genre:request.genre,
                tags:request.tags,
                audioUrl:request.songFilePath,
                audioPublicId: request.audioPublicId,
                lyricsUrl: request.lrcFilePath,
                lyricsPublicId: request.lyricsPublicId,
                artistId:artistId,
                coverImageUrl:request.coverImagePath,
                coverImagePublicId: request.coverImagePublicId,
                duration: request.duration
            }
        const newSong = await this.songRepository.create(songData, session)

        await this.artistRepository.addSongIdToArtist(artistId, newSong._id, session)

        })

        return {success: true}
        
    }
}