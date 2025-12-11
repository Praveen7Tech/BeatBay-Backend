
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";

export class DeleteSongUseCase {
    constructor(
        private readonly _transactionManager: ITransactionManager,
        private readonly _songRepository: ISongRepository,
        private readonly _artistRepository: IArtistRepository,
        private readonly _albumRepository: IAlbumRepository,
        private readonly _playListRepository: IPlayListRepository
    ) {}

    async execute(songId: string, artistId: string): Promise<boolean> {

        const deleteSong =  await this._transactionManager.withTransaction(async (session) => {

            const songDeleted = await this._songRepository.delete(songId, session);
            if (!songDeleted) {
                throw new NotFoundError("Song not found or already deleted!");
            }

            //  Remove songId from artist repository
            await this._artistRepository.removeSongIdFromArtist(artistId, songId, session);

            // Remove songId from albums 
            await this._albumRepository.removeSongFromAllAlbums(songId, session);

            //  Remove song from user playlists 
            await this._playListRepository.removeSongFromAllPlaylists(songId, session);

            // await this.s3Service.deleteFiles(songId);  (fix implimentation in future)
            
        });

        return deleteSong !== null
    }
}
