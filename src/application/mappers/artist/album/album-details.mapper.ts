import { AlbumWithSongs } from "../../../../domain/entities/album.entity";
import { AlbumDetailsDTO } from "../../../dto/album/album.response.dto";


export class AlbumDetailsMapper {
  static toResponse = (
    album: AlbumWithSongs,
    songs: { id: string; title: string; coverImageUrl: string }[]
  ): AlbumDetailsDTO => ({
    id: album._id,
    title: album.title,
    description: album.description,
    coverImageUrl: album.coverImageUrl,
    totalPlays: album.playCount,
    songs,
  });
}

