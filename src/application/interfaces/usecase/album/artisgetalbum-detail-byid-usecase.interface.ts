import { AlbumDetailsDTO } from "../../../dto/album/album.response.dto";

export interface IGetAlbumDetailsByIdUseCase {
    execute(albumId: string): Promise<AlbumDetailsDTO>;
}