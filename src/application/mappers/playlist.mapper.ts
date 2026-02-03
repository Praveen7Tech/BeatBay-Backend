import { PlayList } from "../../domain/entities/playList.entiy";
import { PlayListResponseDTO, PreparedSong } from "../dto/playList/request.dto";

export class PlayListMapper {
  static toResponse(
    playList: PlayList,
    preparedSongs: PreparedSong[]
  ): PlayListResponseDTO {
    const songs = preparedSongs.map(({ song, coverImageUrl, audioUrl }) => ({
      id: song._id.toString(),
      title: song.title,
      coverImageUrl,
      audioUrl,
      duration: song.duration,
      artistName: song.artistName,
    }));

    const totalDuration = songs.reduce(
      (total, song) => total + song.duration,
      0
    );

    return {
      id: playList._id.toString(),
      name: playList.name,
      coverImageUrl: playList.coverImageUrl, 
      description: playList.description || "",
      totalDuration,
      songs,
    };
  }
}

