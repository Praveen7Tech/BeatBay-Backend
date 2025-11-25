import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { CreateAlbumDTO } from "../../dto/album/album.dto";

export class ArtistCreateAlbumUseCase {
    constructor(
        private readonly albumRepository: IAlbumRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly artistRepository: IArtistRepository
    ){}

    async execute (artistId: string, request:CreateAlbumDTO): Promise<{success: boolean}>{

        await this.transactionManager.withTransaction(async(session)=>{
            const AlbumData = {
                artistId: artistId,
                title:request.title,
                description: request.description,
                coverImageUrl: request.coverImageUrl,
                songs: [...request.songs]
            }
            const newAlbum = await this.albumRepository.create(AlbumData)

            await this.artistRepository.addAlbumIdToArtist(artistId, newAlbum._id, session)
        })

       
        return {success: true}
    }
}