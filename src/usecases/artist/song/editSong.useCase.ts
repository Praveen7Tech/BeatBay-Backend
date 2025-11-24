
import { Song } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { UploadSongDTO } from "../../dto/song/song.dto"; 

export class EditSongUseCase {
    constructor(
        private readonly songRepository: ISongRepository
    ){}

    async execute(songId: string, request: Partial<UploadSongDTO>): Promise<{success: boolean}>{

        const updateData: Partial<Song> = {};

        if (request.title) updateData.title = request.title;
        if (request.description) updateData.description = request.description;
        if (request.genre) updateData.genre = request.genre;
        if (request.tags) updateData.tags = request.tags;
        if (request.songFilePath) updateData.audioUrl = request.songFilePath; 
        if (request.lrcFilePath) updateData.lyricsUrl = request.lrcFilePath; 
        if (request.coverImagePath) updateData.coverImageUrl = request.coverImagePath; 
        if (request.duration) updateData.duration = request.duration;

        await this.songRepository.edit(songId, updateData);

        return {success: true};
    }
}
