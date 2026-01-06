import { Album } from "../../../../domain/entities/album.entity";
import { AlbumResponseDTO } from "../../../dto/album/album.response.dto";


export class ArtistAlbumMapper {
  static toAlbumResponseDTO = (album: Album): AlbumResponseDTO => ({
    id: album._id,
    name: album.title,
    coverImageUrl: album.coverImageUrl,
    totalSongs: album.songs.length,
    createdAt: album.createdAt
  });
}
