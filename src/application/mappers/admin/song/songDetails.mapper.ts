import { SongNew } from "../../../../domain/entities/song.entity";
import { AdminSongDetailsDTO } from "../../../dto/admin/songs/songDetails.dto";


export class AdminSongDetailsMapper {
  static toDTO(song: SongNew, coverImageUrl: string): AdminSongDetailsDTO {
    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: coverImageUrl,
      artistName: song.artistName,
      duration: song.duration,
      genre: song.genre,
      tags: song.tags,
      description: song.description,
      status: song.status,
      releaseDate: song.createdAt,
    };
  }
}
