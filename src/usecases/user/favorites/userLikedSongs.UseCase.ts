import { LikedSongsResponseDTO } from "../../../application/dto/favorites/favourites.response.dto";
import { IUserLikedSongsUseCase } from "../../../application/interfaces/usecase/favorites/user-likes-songs-usecase.interface";
import { LikedSongMapper } from "../../../application/mappers/user/favorites/likedsong.mapper";
import { IMongooseLikesRepository } from "../../../domain/repositories/Likes.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

export class UserLikedSongsUseCase implements IUserLikedSongsUseCase{
    constructor(
        private readonly _mongoosesongLikesRepository: IMongooseLikesRepository,
        private readonly _awsStorageService: IAWSS3StorageService
    ){}

    async execute(userId: string, page: number):Promise<LikedSongsResponseDTO>{
        const limit=10
        const {songs, totalCount} = await this._mongoosesongLikesRepository.likedSongs(userId, page)

        const songWithUrls = await Promise.all(
            songs.map(async (raw)=>{
                const song = raw.songDetails;
                const coverImageUrl = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey)
                const audioUrl = await this._awsStorageService.getAccessPresignedUrl(song.audioKey)
                return { raw, coverImageUrl, audioUrl}
            })
        )

        return LikedSongMapper.toSongListResponse(songWithUrls,totalCount, page,limit)
    }
}