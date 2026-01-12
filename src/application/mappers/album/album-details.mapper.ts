import { Album } from "../../../domain/entities/album.entity";
import { AlbumDetailsResponseDTO } from "../../dto/album/album.response.dto";
import { ArtistDetails } from "../../../domain/entities/song.entity";
import { SongMapper } from "../user/song/song.mapper";

function isArtistDetails(artist: string | ArtistDetails): artist is ArtistDetails {
  return typeof artist !== "string" && artist !== null && typeof artist === "object";
}

export class AlbumMapper {
  static toAlbumDetails(album: Album): AlbumDetailsResponseDTO {
    const artist = album.artistId;

    return {
      id: album._id.toString(),
      title: album.title,
      description: album.description,
      coverImageUrl: album.coverImageUrl,
      artistName: isArtistDetails(artist) ? artist.name : "",
      songs: album.songs.map(SongMapper.toSongDetailsDTO) ?? [],
    };
  }
}
