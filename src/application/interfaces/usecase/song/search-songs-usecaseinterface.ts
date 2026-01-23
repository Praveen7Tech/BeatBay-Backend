import { SearchSongsDTO, SongResponseDTO } from "../../../dto/song/song.dto";

export interface ISearchSongsUseCase {
  execute(params: SearchSongsDTO): Promise<SongResponseDTO[]>;
}