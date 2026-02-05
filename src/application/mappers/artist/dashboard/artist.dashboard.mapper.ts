import { Album } from "../../../../domain/entities/album.entity";
import { SongNew } from "../../../../domain/entities/song.entity";
import { TopPlayedAlbumsDTO, TopPlayedSongDTO } from "../../../dto/artist/dashboard/artist.dashboard.dto";

export class ArtistDashboardMapper {
    static toTopSongDTO(song: SongNew,coverImageUrl: string): TopPlayedSongDTO {
        return {
            songId: song._id,
            title: song.title,
            playCount: song.playCount,
            coverImageUrl,
        };
    }
    
    static toTopAlbumDTO(album: Album): TopPlayedAlbumsDTO{
        return {
            albumId: album._id,
            title: album.title,
            coverImageUrl: album.coverImageUrl,
            playCount: album.playCount,
            songs: album.songs.length
        }
    }

    static toDTOList(items:{song: SongNew; coverImageUrl:string}[]): TopPlayedSongDTO[] {
        return items.map(song=> this.toTopSongDTO(song.song, song.coverImageUrl));
    }

    static toDTOAlbumList(album: Album[]): TopPlayedAlbumsDTO[]{
        return album.map(album => this.toTopAlbumDTO(album))
    }
}
