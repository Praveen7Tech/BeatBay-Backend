import { Album } from "../../../../domain/entities/album.entity";
import { Artist } from "../../../../domain/entities/arist.entity";
import { SongNew } from "../../../../domain/entities/song.entity";
import { ArtistProfileDTO } from "../../../dto/admin/artist/artist.profile.dto";

export interface EnrichedSong extends SongNew {
  signedCoverUrl: string;
}

export class ArtistProfileMapper {
  static toDTO(
    artist: Artist,
    songs: EnrichedSong[],
    albums: Album[]
  ): ArtistProfileDTO {
    return {
      name: artist.name,
      bio: artist.bio ?? null,
      profilePicture: artist.profilePicture!,
      status: artist.status!,
      email: artist.email,
      joinDate: artist.createdAt!,
      followersCount: artist.followersCount!,

      // Mapping logic stays here, NOT in the UseCase
      songs: songs.map(s => ({
        id: s._id.toString(),
        title: s.title,
        coverImageUrl: s.signedCoverUrl,
        status: s.status,
        duration: s.duration
      })),

      albums: albums.map(a => ({
        id: a._id.toString(),
        title: a.title,
        coverImageUrl: a.coverImageUrl,
        status: a.isActive,
        createdAt: a.createdAt,
        songsCount: a.songs.length
      })),
    };
  }
}

