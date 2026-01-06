import { Album } from "../../../../domain/entities/album.entity";
import { AlbumDetailsDTO } from "../../../dto/album/album.response.dto";


export class AlbumDetailsMapper {
  static toResponse = (album: Album): AlbumDetailsDTO => ({
    id: album._id,
    title: album.title,
    description: album.description,
    coverImageUrl: album.coverImageUrl,
    songs: album.songs?.map((s: any) => ({
      id: typeof s === "string" ? s : s._id,
      title: typeof s === "string" ? "" : s.title,
      coverImageUrl: typeof s === "string" ? "" : s.coverImageUrl
    })) ?? []
  });
}
