import { IArtistRepository } from "../../../domain/repositories/artist.repository"
import { ArtistTableResponseDTO } from "../../../application/dto/admin/admin.response.dto"
import { ArtistMapper } from "../../../application/mappers/admin/artist/artist.mapper";
import { IFetchAllArtistsUseCase } from "../../../application/interfaces/usecase/admin/fetchall-artist-usecase.interface";

export class FetchAllArtistsUseCase implements IFetchAllArtistsUseCase{
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