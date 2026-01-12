import { Song, ArtistDetails } from "../../../domain/entities/song.entity";
import { HydratedSongDTO } from "../../dto/song/song.response.dto";

function isArtistDetails(artist: string | ArtistDetails): artist is ArtistDetails {
  return typeof artist !== "string" && artist !== null && typeof artist === "object";
}

export class SongHydrationMapper {
  static toDTO(song: Song): HydratedSongDTO {
    let artist;

    if (isArtistDetails(song.artistId)) {
      artist = {
        id: song.artistId._id,
        name: song.artistId.name,
        profilePicture: song.artistId.profilePicture,
      };
    } else {
      artist = {
        id: song.artistId,
        name: "Unknown Artist",
      };
    }

    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: song.coverImageUrl,
      audioUrl: song.audioUrl,
      lyricsUrl: song.lyricsUrl,
      duration: song.duration,
      artist,
    };
  }

  static toDTOList(songs: Song[]): HydratedSongDTO[] {
    return songs.map(this.toDTO);
  }
}
