import { Song } from "../../../../domain/entities/song.entity";
import { SearchSongsDTO, SongResponseDTO } from "../../../dto/song/song.dto";

export interface ISearchSongsUseCase {
  execute(params: SearchSongsDTO): Promise<SongResponseDTO[]>;
}