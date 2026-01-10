import { IToggleSongLikeUseCase } from "../../../application/interfaces/usecase/likes/toggle-song-like-usecase.interface";
import { IMongooseLikesRepository } from "../../../domain/repositories/Likes.repository";

export class ToggleSongLikeStatusUseCase implements IToggleSongLikeUseCase{
    constructor(
        private readonly _mongoosesongLikesRepository: IMongooseLikesRepository
    ){}

    async execute(songId: string, userId: string): Promise<boolean> {
        return await this._mongoosesongLikesRepository.toggleLike(songId,userId)
    }
}