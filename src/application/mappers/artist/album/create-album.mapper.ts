import { SongNew } from "../../../../domain/entities/song.entity";
import { CreateAlbumDTO } from "../../../dto/album/album.dto";


export class ArtistCreateAlbumMapper {
  static toAlbumPersistence = (
    artistId: string,
    artistName: string,
    request: CreateAlbumDTO,
    songs: SongNew[]
  ) => ({
    artistId,
    artistName,
    title: request.title,
    description: request.description,
    coverImageUrl: request.coverImageUrl,
    coverImagePublicId: request.coverImagePublicId,
    songs: request.songs,
    songTitles: songs.map(s => s.title)
  });
}
