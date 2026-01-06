import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { UserPlaylistResponse } from "../../../application/dto/playList/request.dto";
import { PlayListMapper } from "../../../application/mappers/user/playlist/playlist.mapper";

export class GetAllPlaylistUseCase{
    constructor(
        private readonly _playListRepository: IPlayListRepository
    ){}

    async execute(userId: string): Promise<UserPlaylistResponse[]>{
        const playlists = await this._playListRepository.findByUserId(userId);

        return PlayListMapper.toUserPlaylistResponseDTOs(playlists);
        
    }
}