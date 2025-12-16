import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { ForbiddenError, NotFoundError } from "../../../common/errors/common/common.errors";
import { CreateAlbumDTO } from "../../../application/dto/album/album.dto";
import { ISongRepository } from "../../../domain/repositories/song.repository"; 
import { Album } from "../../../domain/entities/album.entity";

export class EditAlbumUseCase {
    constructor(
        private readonly _transactionManager: ITransactionManager,
        private readonly _albumRepository: IAlbumRepository,
        private readonly _songRepository: ISongRepository 
    ) {}

    async execute(artistId: string, albumId: string, data: Partial<CreateAlbumDTO>): Promise<{ success: boolean }> {

        await this._transactionManager.withTransaction(async (session) => {
           
            const album = await this._albumRepository.find(albumId);
           
            if (!album) throw new NotFoundError("Album not found");
           
            if (album.artistId.toString() !== artistId) throw new ForbiddenError();

            const updatedData: Partial<Album> = {}; 

            if (data.title) updatedData.title = data.title;
            if (data.description) updatedData.description = data.description;
            if (data.coverImageUrl) {
                updatedData.coverImageUrl = data.coverImageUrl;
                updatedData.coverImagePublicId = data.coverImagePublicId;
            }

            // Handle Song List Updates 
            if (data.songs) {
                const songIdsToLink = data.songs;

                //  Fetch song titles for denormalization 
                const songsInRequest = await this._songRepository.findSongsByIds(songIdsToLink);
                
                if (songsInRequest.length !== songIdsToLink.length) {
                    throw new NotFoundError("One or more songs not found");
                }

                // songTitles array
                const newSongTitles = songsInRequest.map(song => song.title);

                // Update both fields in the data object
                updatedData.songs = songIdsToLink;      // Array of IDs
                updatedData.songTitles = newSongTitles; // Array of Titles 

            }

            await this._albumRepository.updateById(albumId, updatedData, session);

        });

        return { success: true };
    }
}
