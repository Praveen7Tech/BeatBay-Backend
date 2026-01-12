import { LikedSongsResponseDTO } from "../../../dto/favorites/favourites.response.dto";

export interface IUserLikedSongsUseCase{
    execute(userId: string, page: number): Promise<LikedSongsResponseDTO>
}