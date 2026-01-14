import { Song } from "../../../../domain/entities/song.entity";
import { AlbumSongDetailsDTO } from "../../../dto/album/album.dto";
import { SongListDTO } from "../../../dto/song/song.dto";


export class SongMapper {
  static toSongListDTO = (song: Song): SongListDTO => ({
    id: song._id.toString(),
    title: song.title,
    coverImageUrl: song.coverImageUrl,
    artistName: song.artistName,
    duration: song.duration
  });

  // static toSongDetailsDTO(song: any): AlbumSongDetailsDTO {
  //   return {
  //     id: song._id.toString(),
  //     title: song.title,
  //     coverImageUrl: song.coverImageUrl,
  //     audioUrl: song.audioUrl,
  //     duration: song.duration,
  //   };
  // }
}
