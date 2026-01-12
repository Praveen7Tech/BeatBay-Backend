import { Song } from "../../../domain/entities/song.entity";
import { FetchSongItemDTO } from "../../dto/song/song.response.dto";

export class FetchSongMapper {
  static toDTO(song: Song): FetchSongItemDTO {
    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: song.coverImageUrl,
      duration: song.duration,
      createdAt: song.createdAt.toISOString(),
    };
  }

  static toDTOList(songs: Song[]): FetchSongItemDTO[] {
    return songs.map(this.toDTO);
  }
}
