import { Album } from "../../../../domain/entities/album.entity";
import { AdminAlbumDetailsDTO } from "../../../dto/admin/album/album-details";


export class AdminAlbumDetailsMapper {
  static toDTO(album: Album): AdminAlbumDetailsDTO {
    return {
      id: album._id.toString(),
      title: album.title,
      artistName: album.artistName,
      description: album.description,
      coverImageUrl: album.coverImageUrl,
      isActive: album.isActive,
      createdAt: album.createdAt,

      songs: (album.songs).map((song: any) => ({
        id: song._id.toString(),
        title: song.title,
        coverImageUrl: song.coverImageUrl,
        isActive: song.status
      }))
    };
  }
}
