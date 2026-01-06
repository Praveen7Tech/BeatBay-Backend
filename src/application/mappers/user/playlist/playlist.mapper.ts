
import { PlayList } from "../../../../domain/entities/playList.entiy"; 
import { playListProjection } from "../../../../domain/interfaces/playlist.interface";
import { CreatePlayListResponseDTO, UserPlaylistResponse } from "../../../dto/playList/request.dto";

export class PlayListMapper {

    static toCreatePlayListResponseDTO( playlist: PlayList ): CreatePlayListResponseDTO {
        return {
            id: playlist._id.toString(),
            name: playlist.name
        };
    }

    static toUserPlaylistResponseDTO( playlist: playListProjection ): UserPlaylistResponse {
        return {
            id: playlist._id.toString(),
            name: playlist.name,
            coverImageUrl: playlist.coverImageUrl ?? ''
        };
    }

    static toUserPlaylistResponseDTOs( playlists: playListProjection[] ): UserPlaylistResponse[] {
        return playlists.map(this.toUserPlaylistResponseDTO);
    }
}
