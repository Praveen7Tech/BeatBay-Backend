import { PaginatedAlbumResponse } from "../../../dto/admin/album/album-listing-dto";
import { GetAllAlbumsRequest } from "../../../../domain/interfaces/albumRequest";

export interface IAdminGetAllAlbumsUseCase {
    execute(request: GetAllAlbumsRequest): Promise<PaginatedAlbumResponse>;
}