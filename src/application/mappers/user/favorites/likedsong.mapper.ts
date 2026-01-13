import {
  LikedSongDetails,
  LikedSongs,
  LikedSongsResponseDTO,
} from "../../../dto/favorites/favourites.response.dto";

export class LikedSongMapper {
  static toSongListItem(raw: LikedSongDetails): LikedSongs {
    const song = raw.songDetails;
    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: song.coverImageUrl,
      audioUrl: song.audioUrl,
      duration: song.duration,
      artistName: song.artistName,
      likedAt: raw.createdAt.toISOString(), // liked date from Like collection
    };
  }

  static toSongListResponse(
    songs: LikedSongDetails[],
    total: number,
    page: number,
    limit: number
  ): LikedSongsResponseDTO {
    return {
      songs: songs.map(this.toSongListItem),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
