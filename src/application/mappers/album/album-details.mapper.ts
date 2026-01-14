import { Album } from "../../../domain/entities/album.entity";
import { AlbumDetailsResponseDTO } from "../../dto/album/album.response.dto";
import { ArtistDetails } from "../../../domain/entities/song.entity";
import { SongMapper } from "../user/song/song.mapper";

function isArtistDetails(artist: string | ArtistDetails): artist is ArtistDetails {
  return typeof artist !== "string" && artist !== null && typeof artist === "object";
}

export class AlbumMapper {
  static toAlbumDetails(album: Album, likedSongIds:Set<string>): AlbumDetailsResponseDTO {
    const artist = album.artistId;

    return {
      id: album._id.toString(),
      title: album.title,
      description: album.description,
      coverImageUrl: album.coverImageUrl,
      artistName: album.artistName,
      releaseYear: album.createdAt,
      songs: album.songs.map((song: any) => ({
        id: song._id.toString(),
        title: song.title,
        coverImageUrl: song.coverImageUrl,
        duration: song.duration,
        audioUrl: song.audioUrl,
        isLiked: likedSongIds.has(song._id.toString())
      })),
    };
  }
}
