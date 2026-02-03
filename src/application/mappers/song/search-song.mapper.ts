import { Song, SongNew } from "../../../domain/entities/song.entity";
import { SongResponseDTO } from "../../dto/song/song.dto";


export class SearchSongMapper {
  static toResponseDTO(song: SongNew): SongResponseDTO {
    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: song.coverImageKey,
      artistName: song.artistName,
      duration: song.duration,
      audioUrl: song.audioKey,
    };
  }

  static toResponseDTOList(songs: SongNew[]): SongResponseDTO[] {
    return songs.map(this.toResponseDTO);
  }
}
