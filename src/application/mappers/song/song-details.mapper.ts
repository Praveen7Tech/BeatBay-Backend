import { SongNew, ArtistDetails } from "../../../domain/entities/song.entity";
import { SongDetailsDTO } from "../../dto/song/song.response.dto";

function isArtistDetails(
  artist: string | ArtistDetails
): artist is ArtistDetails {
  return typeof artist === "object" && artist !== null && "_id" in artist;
}

export class SongDetailsMapper {

  // Main song DTO 
  static toDTO( song: SongNew,isLiked: boolean, urls: { audioUrl: string; coverImageUrl: string; lyricsUrl:string }): SongDetailsDTO {

    if (!isArtistDetails(song.artistId)) {
      throw new Error("Artist must be populated");
    }

    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: urls.coverImageUrl,
      audioUrl: urls.audioUrl,
      lyricsUrl: urls.lyricsUrl,
      duration: song.duration,
      streams: song.playCount,
      isLiked,
      artist: {
        id: song.artistId._id.toString(),
        name: song.artistId.name,
        profilePicture: song.artistId.profilePicture,
      },
    };
  }

  // Recommended song DTO 
  static toRecommendedDTO(
    song: SongNew,
    isLiked: boolean,
    urls: { audioUrl: string; coverImageUrl: string }
  ): SongDetailsDTO {

    if (!isArtistDetails(song.artistId)) {
      throw new Error("Artist must be populated");
    }

    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: urls.coverImageUrl,
      audioUrl: urls.audioUrl,
      lyricsUrl: "", 
      duration: song.duration,
      isLiked,
      streams: song.playCount,
      artist: {
        id: song.artistId._id.toString(),
        name: song.artistId.name,
        profilePicture: song.artistId.profilePicture,
      },
    };
  }

  static toRecommendedDTOList(
    songs: { song: SongNew; isLiked: boolean; urls: { audioUrl: string; coverImageUrl: string }; }[]
  ): SongDetailsDTO[] {
     return songs.map(item => this.toRecommendedDTO(item.song, item.isLiked, item.urls) );
  }
}
