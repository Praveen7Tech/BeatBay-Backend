import { Artist } from "../../../domain/entities/arist.entity"
import { IArtistRepository } from "../../../domain/repositories/artist.repository"
import { ArtistTableResponseDTO } from "../../dto/admin/admin.response.dto"

export class FetchAllArtistsUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(page: number, limit:number, search: string): Promise<ArtistTableResponseDTO>{

            const {data:artists, totalCount} = await this._artistRepository.findAll(page, limit, search)
    
            const response = artists.map((artist: Artist)=>({
                id: artist._id!,
                name: artist.name!,
                email: artist.email!,
                profilePicture: artist.profilePicture!,
                status: artist.status!,
                joinDate: new Date(artist.createdAt!).toISOString().split("T")[0],
                followersCount: artist.followersCount || 0,
                songsCount: artist.songs?.length!
            }))
            const totalPages = Math.ceil(totalCount/ limit)
    
            return {artist:response, totalCount, page, limit, totalPages}
        }
}