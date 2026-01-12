import { LikedSongsResponseDTO } from "../../../application/dto/favorites/favourites.response.dto";
import { IUserLikedSongsUseCase } from "../../../application/interfaces/usecase/favorites/user-likes-songs-usecase.interface";
import { LikedSongMapper } from "../../../application/mappers/user/favorites/likedsong.mapper";
import { IMongooseLikesRepository } from "../../../domain/repositories/Likes.repository";

export class UserLikedSongsUseCase implements IUserLikedSongsUseCase{
    constructor(
        private readonly _mongoosesongLikesRepository: IMongooseLikesRepository
    ){}

    async execute(userId: string, page: number):Promise<LikedSongsResponseDTO>{
        const limit=10
        const {songs, totalCount} = await this._mongoosesongLikesRepository.likedSongs(userId, page)

        return LikedSongMapper.toSongListResponse(songs,totalCount, page,limit)
    }
}