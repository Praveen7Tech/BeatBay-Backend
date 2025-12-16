import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { CreateAlbumDTO } from "../../../application/dto/album/album.dto";

export class ArtistCreateAlbumUseCase {
    constructor(
        private readonly _albumRepository: IAlbumRepository,
        private readonly _transactionManager: ITransactionManager,
        private readonly _artistRepository: IArtistRepository,
        private readonly _songRepository: ISongRepository
    ){}

    async execute (artistId: string, request:CreateAlbumDTO): Promise<{success: boolean}>{

        await this._transactionManager.withTransaction(async(session)=>{

            const artist = await this._artistRepository.findById(artistId);
            if (!artist) throw new Error("Artist not found.");
            const artistName = artist.name; 

             // Fetch all required Song titles 
            const songsInRequest = await this._songRepository.findSongsByIds(request.songs);
            // Map song IDs to the new required structure [{songId, songTitle}]
            const songTitles = songsInRequest.map(song => song.title);

            const AlbumData = {
                artistId: artistId,
                artistName: artistName,
                title:request.title,
                description: request.description,
                coverImageUrl: request.coverImageUrl,
                coverImagePublicId: request.coverImagePublicId,
                songs: [...request.songs],
                songTitles: songTitles
            }
            const newAlbum = await this._albumRepository.create(AlbumData, session)

            await this._artistRepository.addAlbumIdToArtist(artistId, newAlbum._id, session)

        })

       
        return {success: true}
    }
}