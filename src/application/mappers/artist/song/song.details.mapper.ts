import { SongNew } from "../../../../domain/entities/song.entity";
import { ArtistSongDetailsDTO } from "../../../dto/artist/song/artist.songDetails.dto";


export class ArtistSongDetailsMapper {
  static toDTO(song: SongNew, urls: {
      audioUrl: string;
      coverImageUrl: string;
      lyricsUrl: string;
    }
  ): ArtistSongDetailsDTO {
    return {
      id: song._id.toString(),
      uploadId: song.uploadId,
      title: song.title,
      description: song.description,
      genre: song.genre,
      tags: song.tags,
      audioUrl: urls.audioUrl,
      coverImageUrl: urls.coverImageUrl,
      lyricsUrl: urls.lyricsUrl,
      createdAt: song.createdAt
    };
  }
}
