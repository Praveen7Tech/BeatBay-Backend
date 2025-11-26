import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class DeleteAlbumUsecase{
    constructor(
        private readonly transactionManager: ITransactionManager,
        private readonly albumRepository: IAlbumRepository,
        private readonly artistRepository: IArtistRepository
    ){}

    async execute(albumId: string, artistId:string): Promise<boolean>{

        const deleteAlbum = await this.transactionManager.withTransaction(async(session)=>{

            const album = await this.albumRepository.delete(albumId, session)
            if (!album) {
                throw new NotFoundError("Song not found or already deleted!");
            }

            // delete albumId from artist
            await this.artistRepository.removeAlbumIdFromArtist(artistId,albumId,session)
        })

        return deleteAlbum !== null
    }
}