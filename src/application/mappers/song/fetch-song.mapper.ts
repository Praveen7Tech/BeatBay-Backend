import { SongNew } from "../../../domain/entities/song.entity";
import { FetchSongItemDTO } from "../../dto/song/song.response.dto";

export class FetchSongMapper {
  static toDTO(song: SongNew, coverImageUrl: string): FetchSongItemDTO {
    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: coverImageUrl,
      duration: song.duration,
      createdAt: song.createdAt.toISOString(),
    };
  }

  static toDTOList(items:{song: SongNew; coverImageUrl:string}[]): FetchSongItemDTO[] {
    return items.map(song=> this.toDTO(song.song, song.coverImageUrl));
  }
}
