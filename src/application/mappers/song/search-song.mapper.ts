import { PreparedSong, SongResponseDTO } from "../../dto/song/song.dto";


export class SearchSongMapper {
  static toResponseDTO(prepared: PreparedSong): SongResponseDTO {
    const song = prepared.song;
    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: prepared.coverImageUrl, 
      artistName: song.artistName,
      duration: song.duration,
      audioUrl: prepared.audioUrl, 
    };
  }

  static toResponseDTOList(songs: PreparedSong[]): SongResponseDTO[] {
    return songs.map(this.toResponseDTO);
  }
}

