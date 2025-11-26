// src/application/useCases/deleteSong.useCase.ts

import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";

export class DeleteSongUseCase {
    constructor(
        private readonly transactionManager: ITransactionManager,
        private readonly songRepository: ISongRepository,
        private readonly artistRepository: IArtistRepository,
        private readonly albumRepository: IAlbumRepository,
        private readonly playListRepository: IPlayListRepository
    ) {}

    async execute(songId: string, artistId: string): Promise<boolean> {

        const deleteSong =  await this.transactionManager.withTransaction(async (session) => {

            const songDeleted = await this.songRepository.delete(songId, session);
            if (!songDeleted) {
                throw new NotFoundError("Song not found or already deleted!");
            }

            //  Remove songId from artist repository
            await this.artistRepository.removeSongIdFromArtist(artistId, songId, session);

            // Remove songId from albums 
            await this.albumRepository.removeSongFromAllAlbums(songId, session);

            //  Remove song from user playlists 
            await this.playListRepository.removeSongFromAllPlaylists(songId, session);

            // await this.s3Service.deleteFiles(songId);  (fix implimentation in future)
            
        });

        return deleteSong !== null
    }
}
