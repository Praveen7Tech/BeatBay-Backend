import {  SongNew } from "../../../../domain/entities/song.entity";
import { SongListDTO } from "../../../dto/song/song.dto";


export class SongMapper {
  static toSongListDTO = (song: SongNew, coverImage: string): SongListDTO => ({
    id: song._id.toString(),
    title: song.title,
    coverImageUrl: coverImage,
    artistName: song.artistName,
    duration: song.duration
  });

}
