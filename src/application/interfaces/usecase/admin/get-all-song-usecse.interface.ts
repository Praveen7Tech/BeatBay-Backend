import { PaginatedSongResponse } from "../../../dto/admin/songs/song-listing.dto";
import { GetAllSongsRequest } from "../../../../domain/interfaces/songRequest";

export interface IGetAllSongsUseCase {
    execute(request: GetAllSongsRequest): Promise<PaginatedSongResponse>;
}