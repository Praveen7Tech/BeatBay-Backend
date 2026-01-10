
import { IDeleteSongUseCase } from "../../../application/interfaces/usecase/song/artist-delete-song-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";

export class DeleteSongUseCase implements IDeleteSongUseCase{
    constructor(
        private readonly _transactionManager: ITransactionManager,
        private readonly _songRepository: ISongRepository,
        private readonly _artistRepository: IArtistRepository,
        private readonly _albumRepository: IAlbumRepository,
        private readonly _playListRepository: IPlayListRepository
    ) {}

    async execute(songId: string, artistId: string): Promise<boolean> {

        const deleteSong =  await this._transactionManager.withTransaction(async (session) => {

            const{ song} = await this._songRepository.findById(songId)
            
            const songDeleted = await this._songRepository.delete(songId, session);
            if (!songDeleted || !song) {
                throw new NotFoundError("Song not found or already deleted!");
            }
            const songTitle = song.title

            //  Remove songId from artist repository
            await this._artistRepository.removeSongIdFromArtist(artistId, songId, session);

            // Remove songId and title from albums 
            await this._albumRepository.removeSongFromAllAlbums(songId, session);
            await this._albumRepository.removeSongTitleFromAllAlbums(songTitle, session)

            //  Remove song from user playlists 
            await this._playListRepository.removeSongFromAllPlaylists(songId, session);

            // await this.s3Service.deleteFiles(songId);  (fix implimentation in future)
            
        });

        return deleteSong !== null
    }
}
