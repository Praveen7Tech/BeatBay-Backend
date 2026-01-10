import { AdminAlbumDetailsDTO } from "../../../dto/admin/album/album-details";

export interface IAdminGetAlbumDetailsByIdUseCase {
    execute(albumId: string): Promise<AdminAlbumDetailsDTO>;
}