
import { SongNew } from "../../../domain/entities/song.entity";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { EditSongDTO } from "../../../application/dto/song/song.dto"; 
import { IEditSongUseCase } from "../../../application/interfaces/usecase/song/artist-edit-song-usecase.interface";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";
import { NotFoundError } from "../../../common/errors/common/common.errors";

export class EditSongUseCase implements IEditSongUseCase{
    constructor(
        private readonly _songRepository: ISongRepository,
        private readonly _albumRepository: IAlbumRepository,
        private readonly _transactionManager: ITransactionManager,
        private readonly _awsStorageService: IAWSS3StorageService
    ){}

    async execute(songId: string, request: Partial<EditSongDTO>,): Promise<{success: boolean}>{

        const existingSong = await this._songRepository.findById(songId)
        if(!existingSong) throw new NotFoundError("Song not found!")

        await this._transactionManager.withTransaction(async(session)=>{

            const updateData: Partial<SongNew> = {};

            if (request.title) updateData.title = request.title;
            if (request.description) updateData.description = request.description;
            if (request.genre) updateData.genre = request.genre;
            if (request.tags) updateData.tags = request.tags;
            if (request.duration) updateData.duration = request.duration;

            if (request.trackKey) updateData.audioKey = request.trackKey; 
            if (request.coverKey) updateData.coverImageKey = request.coverKey; 
            if (request.lyricsKey) updateData.lyricsKey = request.lyricsKey; 

            const keysToDelete : string[] =[]
            if (request.trackKey && request.trackKey !== existingSong.audioKey) 
                keysToDelete.push(existingSong.audioKey);
            if (request.coverKey && request.coverKey !== existingSong.coverImageKey) 
                keysToDelete.push(existingSong.coverImageKey);
            if (request.lyricsKey && request.lyricsKey !== existingSong.lyricsKey) 
                keysToDelete.push(existingSong.lyricsKey);

            // edit/ update song with new data
            await this._songRepository.edit(songId, updateData, session);

            if(request.title){
                await this._albumRepository.updateSongTitleInAlbums(songId,request.title,session)
            }

            if(keysToDelete.length > 0){
                await Promise.all(
                    keysToDelete.map(key => this._awsStorageService.deleteFile(key))
                )
            }
        })

        return {success: true};
    }
}
