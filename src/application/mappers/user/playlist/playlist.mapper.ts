
import { PlayList } from "../../../../domain/entities/playList.entiy"; 
import { playListProjection } from "../../../../domain/interfaces/playlist.interface";
import { CreatePlayListResponseDTO, UserPlaylistDTO, } from "../../../dto/playList/request.dto";

export class PlayListMapper {

    static toCreatePlayListResponseDTO( playlist: PlayList ): CreatePlayListResponseDTO {
        return {
            id: playlist._id.toString(),
            name: playlist.name
        };
    }

    static toUserPlaylistResponseDTO( playlist: playListProjection ): UserPlaylistDTO {
        return {
            id: playlist._id.toString(),
            name: playlist.name,
            coverImageUrl: playlist.coverImageUrl ?? ''
        };
    }

    static toUserPlaylistResponseDTOs( playlists: playListProjection[] ): UserPlaylistDTO[] {
        return playlists.map(this.toUserPlaylistResponseDTO);
    }
}
