import { Album } from "../../../../domain/entities/album.entity";
import { Artist } from "../../../../domain/entities/arist.entity";
import { Song } from "../../../../domain/entities/song.entity";
import { User } from "../../../../domain/entities/user.entity";
import { AlbumDTO, ArtistDTO, SongDTO, TopResultDTO } from "../../../dto/search/search.response.dto";


export class SearchMapper {

  static song = (s: Song): SongDTO => ({
    id: s._id.toString(),
    title: s.title,
    artist: s.artistName,
    duration: s.duration,
    coverImageUrl: s.coverImageUrl
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

  static topResult = (s: Song | null): TopResultDTO | null =>
    s
      ? {
          id: s._id.toString(),
          title: s.title,
          artist: s.artistName,
          coverImageUrl: s.coverImageUrl
        }
      : null;
}
