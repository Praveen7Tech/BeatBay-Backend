import { Album } from "../../../domain/entities/album.entity";
import { FetchAlbumItemDTO } from "../../dto/album/album.response.dto";

export class FetchAlbumMapper {
  static toDTO(album: Album): FetchAlbumItemDTO {
    return {
      id: album._id.toString(),
      title: album.title,
      coverImageUrl: album.coverImageUrl,
    };
  }

  static toDTOList(albums: Album[]): FetchAlbumItemDTO[] {
    return albums.map(this.toDTO);
  }
}
