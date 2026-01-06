import { Artist } from "../../../domain/entities/arist.entity"
import { IArtistRepository } from "../../../domain/repositories/artist.repository"
import { ArtistTableResponseDTO } from "../../../application/dto/admin/admin.response.dto"
import { ArtistMapper } from "../../../application/mappers/admin/artist/artist.mapper";

export class FetchAllArtistsUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(page: number, limit:number, search: string): Promise<ArtistTableResponseDTO>{

            const {data:artists, totalCount} = await this._artistRepository.findAll(page, limit, search)
    
            const response = ArtistMapper.toTableRows(artists);
            const totalPages = Math.ceil(totalCount/ limit)
    
            return {artist:response, totalCount, page, limit, totalPages}
        }
}