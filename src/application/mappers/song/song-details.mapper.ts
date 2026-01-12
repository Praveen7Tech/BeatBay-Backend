import { Song, ArtistDetails } from "../../../domain/entities/song.entity";
import { SongDetailsDTO } from "../../dto/song/song.response.dto";

function isArtistDetails(
  artist: string | ArtistDetails
): artist is ArtistDetails {
  return typeof artist === "object" && artist !== null && "_id" in artist;
}

export class SongDetailsMapper {

  static toDTO(song: Song, isLiked: boolean): SongDetailsDTO {
    if (!isArtistDetails(song.artistId)) {
      throw new Error("Artist must be populated");
    }

    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: song.coverImageUrl,
      audioUrl: song.audioUrl,
      lyricsUrl: song.lyricsUrl,
      duration: song.duration,
      isLiked,
      artist: {
        id: song.artistId._id.toString(),
        name: song.artistId.name,
        profilePicture: song.artistId.profilePicture,
      },
    };
  }

  static toDTOList(
    songs: { song: Song; isLiked: boolean }[]
  ): SongDetailsDTO[] {
    return songs.map(item =>
      this.toDTO(item.song, item.isLiked)
    );
  }
}
