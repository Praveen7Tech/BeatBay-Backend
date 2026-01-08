import { Song } from "../../../../domain/entities/song.entity";
import { AdminSongListItemDTO } from "../../../dto/admin/songs/song-listing.dto";


export class AdminSongMapper {
  static toListItemDTO(song: Song): AdminSongListItemDTO {
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

  static toListItemDTOs(songs: Song[]): AdminSongListItemDTO[] {
    return songs.map(this.toListItemDTO);
  }
}
