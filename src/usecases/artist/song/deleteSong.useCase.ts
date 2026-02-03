
import { IDeleteSongUseCase } from "../../../application/interfaces/usecase/song/artist-delete-song-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";
import { ITransactionManager } from "../../../domain/services/transaction.service";

export class DeleteSongUseCase implements IDeleteSongUseCase{
    constructor(
        private readonly _transactionManager: ITransactionManager,
        private readonly _songRepository: ISongRepository,
        private readonly _artistRepository: IArtistRepository,
        private readonly _albumRepository: IAlbumRepository,
        private readonly _playListRepository: IPlayListRepository,
        private readonly _awsStorageService: IAWSS3StorageService
    ) {}

    async execute(songId: string, artistId: string): Promise<boolean> {

        const song = await this._songRepository.findById(songId)
        if (!song) throw new NotFoundError("Song not found!");
        const keysToDelete = [song.audioKey, song.coverImageKey, song.lyricsKey]

        await this._transactionManager.withTransaction(async (session) => {
            
            const songDeleted = await this._songRepository.delete(songId, session);
            if (!songDeleted ) {
                throw new NotFoundError("Failed to delete song!");
            }
            const songTitle = song.title

            //  remove songId from artist repository
            await this._artistRepository.removeSongIdFromArtist(artistId, songId, session);

            // remove songId and title from albums 
            await this._albumRepository.removeSongFromAllAlbums(songId, session);
            await this._albumRepository.removeSongTitleFromAllAlbums(songTitle, session)

            //  remove song from user playlists 
            await this._playListRepository.removeSongFromAllPlaylists(songId, session);
            
        });

        // delete song files from aws s3
        try {
            if(keysToDelete.length > 0){
                await Promise.all(keysToDelete.map(key => this._awsStorageService.deleteFile(key)))
            }
        } catch (error) {
            console.error("Error in delete s3 files", error)
        }

        return true
    }
}
