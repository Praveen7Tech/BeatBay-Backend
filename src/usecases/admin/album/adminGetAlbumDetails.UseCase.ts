
import { AdminAlbumDetailsDTO } from "../../../application/dto/admin/album/album-details";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class AdminGetAlbumDetailsByIdUseCase {
    constructor(private readonly _albumRepository: IAlbumRepository) {}

    async execute(albumId: string): Promise<AdminAlbumDetailsDTO | null> {
        const album = await this._albumRepository.adminFindById(albumId);
        
        if (!album) {
            throw new Error("ALBUM_NOT_FOUND");
        }

        const response: AdminAlbumDetailsDTO = {
            id: album._id.toString(),
            title: album.title,
            artistName: album.artistName,
            description: album.description,
            coverImageUrl: album.coverImageUrl,
            isActive: album.isActive,
            createdAt: album.createdAt,
            songs: (album.songs || []).map((song: any) => ({
                id: song._id.toString(),
                title: song.title,
                coverImageUrl: song.coverImageUrl,
                isActive: song.status
            }))
        };
        console.log("resu", response)

        return response;
    }
}