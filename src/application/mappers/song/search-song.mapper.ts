import { Song } from "../../../domain/entities/song.entity";
import { SongResponseDTO } from "../../dto/song/song.dto";


export class SearchSongMapper {
  static toResponseDTO(song: Song): SongResponseDTO {
    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: song.coverImageUrl,
      artistName: song.artistName,
      duration: song.duration,
      audioUrl: song.audioUrl,
    };
  }

  static toResponseDTOList(songs: Song[]): SongResponseDTO[] {
    return songs.map(this.toResponseDTO);
  }
}
