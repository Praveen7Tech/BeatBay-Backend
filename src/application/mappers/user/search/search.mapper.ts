import { Album } from "../../../../domain/entities/album.entity";
import { Artist } from "../../../../domain/entities/arist.entity";
import { User } from "../../../../domain/entities/user.entity";
import { AlbumDTO, ArtistDTO, SongDTO, TopResultDTO } from "../../../dto/search/search.response.dto";
import { PreparedSong, PreparedTopResult } from "../../../dto/song/song.dto";


export class SearchMapper {

  static song = (s: PreparedSong): SongDTO => ({
    id: s.song._id.toString(),
    title: s.song.title,
    artistName: s.song.artistName,
    duration: s.song.duration,
    coverImageUrl: s.coverImageUrl,
    audioUrl: s.audioUrl
  });

  static album = (a: Album): AlbumDTO => ({
    id: a._id.toString(),
    title: a.title,
    artist: a.artistName,
    coverImageUrl: a.coverImageUrl
  });

  static artist = (a: Artist): ArtistDTO => ({

    id: a._id.toString(),
    name: a.name,
    profilePicture: a.profilePicture ?? ''
  });

  static user = (u: User): ArtistDTO => ({
    id: u._id.toString(),
    name: u.name ?? '',
    profilePicture: u.profilePicture ?? ''
  });

  static topResult = (s: PreparedTopResult | null): TopResultDTO | null =>
    s
      ? {
          id: s.song._id.toString(),
          title: s.song.title,
          artist: s.song.artistName,
          coverImageUrl: s.coverImageUrl
        }
      : null;
}
