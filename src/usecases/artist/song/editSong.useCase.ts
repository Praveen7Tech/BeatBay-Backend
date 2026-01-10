
import { Song } from "../../../domain/entities/song.entity";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { EditSongDTO } from "../../../application/dto/song/song.dto"; 
import { IEditSongUseCase } from "../../../application/interfaces/usecase/song/artist-edit-song-usecase.interface";

export class EditSongUseCase implements IEditSongUseCase{
    constructor(
        private readonly _songRepository: ISongRepository,
        private readonly _albumRepository: IAlbumRepository,
        private readonly _transactionManager: ITransactionManager
    ){}

    async execute(songId: string, request: Partial<EditSongDTO>): Promise<{success: boolean}>{

        await this._transactionManager.withTransaction(async(session)=>{

            const updateData: Partial<Song> = {};

            if (request.title) updateData.title = request.title;
            if (request.description) updateData.description = request.description;
            if (request.genre) updateData.genre = request.genre;
            if (request.tags) updateData.tags = request.tags;
            if (request.songFilePath) updateData.audioUrl = request.songFilePath; 
            if (request.audioPublicId) updateData.audioPublicId = request.audioPublicId; 
            if (request.lrcFilePath) updateData.lyricsUrl = request.lrcFilePath; 
            if (request.lyricsPublicId) updateData.lyricsPublicId = request.lyricsPublicId; 
            if (request.coverImagePath) updateData.coverImageUrl = request.coverImagePath; 
            if (request.coverImagePublicId) updateData.coverImagePublicId = request.coverImagePublicId; 
            if (request.duration) updateData.duration = request.duration;

            await this._songRepository.edit(songId, updateData, session);

            if(request.title){
                await this._albumRepository.updateSongTitleInAlbums(songId,request.title,session)
            }
        })

        

        return {success: true};
    }
}
