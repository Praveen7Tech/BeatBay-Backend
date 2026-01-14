import { Artist } from "../../../../domain/entities/arist.entity";
import { ArtistPopulated } from "../../../../domain/interfaces/albumRequest";
import { ArtistDetailsResponseDTO } from "../../../dto/artist/artist.profile.dto";


export class ArtistDetailsMapper {
  static toResponse(artist: ArtistPopulated): ArtistDetailsResponseDTO {
    return {
      id: artist._id.toString(),
      name: artist.name,
      profilePicture: artist.profilePicture || "",
      bio: artist.bio || "",

      albums: artist.albums?.map((album) => ({
        id: album._id.toString(),
        title: album.title,
        coverImageUrl: album.coverImageUrl,
      })) || [],

      songs: artist.songs?.map((song) => ({
        id: song._id.toString(),
        title: song.title,
        coverImageUrl: song.coverImageUrl,
        artistName: song.artistName,
        duration: song.duration
      })) || [],
    };
  }
}
