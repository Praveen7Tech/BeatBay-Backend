import { LikedSongDetails, LikedSongs, LikedSongsResponseDTO, PreparedLikedSong } from "../../../dto/favorites/favourites.response.dto";


export class LikedSongMapper {
  static toSongListItem(prepared: PreparedLikedSong): LikedSongs {
    const song = prepared.raw.songDetails;

    return {
      id: song._id.toString(),
      title: song.title,
      coverImageUrl: prepared.coverImageUrl,
      audioUrl: prepared.audioUrl,
      duration: song.duration,
      artistName: song.artistName,
      likedAt: prepared.raw.createdAt.toISOString(),
    };
  }

  static toSongListResponse(songs: PreparedLikedSong[], total: number,page: number,limit: number
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
