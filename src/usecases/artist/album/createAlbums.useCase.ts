import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { CreateAlbumDTO } from "../../dto/album/album.dto";

export class ArtistCreateAlbumUseCase {
    constructor(
        private readonly albumRepository: IAlbumRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly artistRepository: IArtistRepository,
        private readonly songRepository: ISongRepository
    ){}

    async execute (artistId: string, request:CreateAlbumDTO): Promise<{success: boolean}>{

        await this.transactionManager.withTransaction(async(session)=>{
            const AlbumData = {
                artistId: artistId,
                title:request.title,
                description: request.description,
                coverImageUrl: request.coverImageUrl,
                coverImagePublicId: request.coverImagePublicId,
                songs: [...request.songs]
            }
            const newAlbum = await this.albumRepository.create(AlbumData)

            await this.artistRepository.addAlbumIdToArtist(artistId, newAlbum._id, session)

            const songIds = request.songs
            const albumId = newAlbum._id

            await this.songRepository.addAlbumIdToSongs(songIds, albumId, session)
        })

       
        return {success: true}
    }
}