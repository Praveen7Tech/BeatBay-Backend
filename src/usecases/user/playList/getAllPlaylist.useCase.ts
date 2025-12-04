import { NotFoundError } from "../../../common/errors/common/common.errors";
import { PlayList } from "../../../domain/entities/playList.entiy";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { UserPlaylistResponse } from "../../dto/playList/request.dto";

export class GetAllPlaylistUseCase{
    constructor(
        private readonly playListRepository: IPlayListRepository
    ){}

    async execute(userId: string): Promise<UserPlaylistResponse[] | []>{
        const playlists = await this.playListRepository.findByUserId(userId);

        const response = playlists.map((ply)=>({
            id:ply._id.toString(),
            name: ply.name,
            coverImageUrl: ply.coverImageUrl
        }))


        return response
        
    }
}