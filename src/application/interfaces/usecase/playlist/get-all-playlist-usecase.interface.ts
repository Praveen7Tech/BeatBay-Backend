import { UserPlaylistResponse } from "../../../dto/playList/request.dto";

export interface IGetAllPlaylistUseCase {
    execute(userId: string): Promise<UserPlaylistResponse[]>;
}