import { FetchSongsResponseDTO } from "../../../dto/song/song.response.dto";

export interface IFetchSongsUsecase {
    execute(): Promise<FetchSongsResponseDTO>;
}