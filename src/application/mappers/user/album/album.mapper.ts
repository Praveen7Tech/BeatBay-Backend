import { AlbumListDTO } from "../../../dto/album/album.dto"; 
import { Album } from "../../../../domain/entities/album.entity"; 

export class AlbumMapper {
    static toAlbumListDTO(album: Album): AlbumListDTO {
        return {
            id: album._id.toString(),
            title: album.title,
            artistName: album.artistName,
            coverImageUrl: album.coverImageUrl
        };
    }

    static toAlbumListDTOs(albums: Album[]): AlbumListDTO[] {
        return albums.map(this.toAlbumListDTO);
    }
}
