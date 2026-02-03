import { AlbumWithSongs } from "../../../domain/entities/album.entity";
import { AlbumDetailsResponseDTO } from "../../dto/album/album.response.dto";

export class AlbumMapper {
  static toAlbumDetails(album: AlbumWithSongs, likedSongIds:Set<string>): AlbumDetailsResponseDTO {

    return {
      id: album._id.toString(),
      title: album.title,
      description: album.description,
      coverImageUrl: album.coverImageUrl,
      artistName: album.artistName,
      releaseYear: album.createdAt,
      songs: album.songs.map((song) => ({
        id: song._id.toString(),
        title: song.title,
        coverImageUrl: song.coverImageUrl!,
        duration: song.duration,
        audioUrl: song.audioUrl!,
        isLiked: likedSongIds.has(song._id.toString())
      })),
    };
  }
}
