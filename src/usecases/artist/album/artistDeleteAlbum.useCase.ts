import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class DeleteAlbumUsecase{
    constructor(
        private readonly _transactionManager: ITransactionManager,
        private readonly _albumRepository: IAlbumRepository,
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(albumId: string, artistId:string): Promise<boolean>{

        const deleteAlbum = await this._transactionManager.withTransaction(async(session)=>{

            const album = await this._albumRepository.delete(albumId, session)
            if (!album) {
                throw new NotFoundError("Song not found or already deleted!");
            }

            // delete albumId from artist
            await this._artistRepository.removeAlbumIdFromArtist(artistId,albumId,session)
        })

        return deleteAlbum !== null
    }
}