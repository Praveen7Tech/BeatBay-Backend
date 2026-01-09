import { PaginatedResponseDTO, SongListDTO } from "../../../dto/song/song.dto";

export interface IFetchAllSongsUsecase {
    execute(page: number, limit: number, query?: string): Promise<PaginatedResponseDTO<SongListDTO>>;
}