import { ISongRepository } from "../../../domain/repositories/song.repository";
import { UploadSongDTO } from "../../dto/song/song.dto";

export class UploadSongUseCase {
    constructor(
        private readonly songRepository: ISongRepository
    ){}

    async execute(artistId:string,request: UploadSongDTO): Promise<{success: boolean}>{
         const newSong = await this.songRepository.create({
            title: request.title,
            description:request.description,
            genre:request.genre,
            tags:request.tags,
            album:request.album,
            lyrics:request.lyrics,
            releaseDate:request.releaseDate,
            audioUrl:request.songFilePath,
            artistId:artistId,
            coverImageUrl:request.coverImagePath,
         })

         return {success: true}
    }
}