import { FetchSongsResponseDTO } from "../../../dto/song/song.response.dto";

export interface IGetSongsUseCase {
    execute(artistId: string): Promise<FetchSongsResponseDTO>;
}