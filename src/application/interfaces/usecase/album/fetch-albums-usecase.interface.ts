
import { FetchAlbumsResponseDTO } from "../../../dto/album/album.response.dto";

export interface IFetchAlbumsUsecase {
    execute(): Promise<FetchAlbumsResponseDTO>;
}