import { AdminSongListItemDTO } from "../../../dto/admin/songs/song-listing.dto";
import { PreparedAdminSong } from "../../../dto/song/song.dto";


export class AdminSongMapper {
  static toListItemDTO(song: PreparedAdminSong): AdminSongListItemDTO {
    return {
      id: song._id.toString(),
      title: song.title,
      genre: song.genre,
      coverImageUrl: song.coverImageUrl,
      duration: song.duration,
      status: song.status,
      likesCount: song.likesCount,
      uploadDate: song.createdAt
    };
  }

  static toListItemDTOs(songs: PreparedAdminSong[]): AdminSongListItemDTO[] {
    return songs.map(this.toListItemDTO);
  }
}
