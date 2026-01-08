import { Album } from "../../../../domain/entities/album.entity";
import { AdminAlbumListItemDTO } from "../../../dto/admin/album/album-listing-dto";


export class AdminAlbumMapper {
  static toListItemDTO(album: Album): AdminAlbumListItemDTO {
    return {
      id: album._id.toString(),
      title: album.title,
      artistName: album.artistName,
      coverImageUrl: album.coverImageUrl,
      trackCount: album.songs?.length ?? 0,
      isActive: album.isActive,
      createdAt: album.createdAt
    };
  }

  static toListItemDTOs(albums: Album[]): AdminAlbumListItemDTO[] {
    return albums.map(this.toListItemDTO);
  }
}
