import { AlbumListDTO } from "../../../dto/album/album.dto";
import { PaginatedResponseDTO } from "../../../dto/song/song.dto";

export interface IFetchAllAlbumsUsecase {
    execute(page: number, limit: number, query?: string): Promise<PaginatedResponseDTO<AlbumListDTO>>;
}