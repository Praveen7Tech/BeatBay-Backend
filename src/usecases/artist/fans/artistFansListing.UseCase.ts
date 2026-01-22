import { FansResponseDTO } from "../../../application/dto/artist/dashboard/artist.dashboard.dto";
import { IGetAllFansUseCase } from "../../../application/interfaces/usecase/artist/fans/artist-getallfans-usecase.interface";
import { FansListMapper } from "../../../application/mappers/artist/fans/fans-listing.mapper";
import { IFollowersRepository } from "../../../domain/repositories/followers.repository";

export class ArtistFansListingUseCase implements IGetAllFansUseCase{
    constructor(
        private readonly _mongoosefollowersRepository: IFollowersRepository
    ){}

    async execute(artistId: string, page: number, limit: number): Promise<FansResponseDTO> {
       
        const {followers, total} = await this._mongoosefollowersRepository.getFollowersList(artistId,page,limit)

        const fans = FansListMapper.toFansMapping(followers)

        return {
            fans: fans,
            totalCount: total,
            totalPages: Math.ceil(total / limit) || 1
        }
    }
}