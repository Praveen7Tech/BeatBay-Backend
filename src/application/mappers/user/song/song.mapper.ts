import { Song } from "../../../../domain/entities/song.entity";
import { SongListDTO } from "../../../dto/song/song.dto";


export class SongMapper {
  static toSongListDTO = (song: Song): SongListDTO => ({
    id: song._id.toString(),
    title: song.title,
    coverImageUrl: song.coverImageUrl,
    artistName: song.artistName,
    duration: song.duration
  });
}
