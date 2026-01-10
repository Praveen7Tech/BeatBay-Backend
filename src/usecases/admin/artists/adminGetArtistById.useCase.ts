import { IGetArtistByIdUseCase } from "../../../application/interfaces/usecase/artist-features/get-artist-byid-usecase.interface"
import { Artist } from "../../../domain/entities/arist.entity"
import { IArtistRepository } from "../../../domain/repositories/artist.repository"

export class GetArtistByIdUseCase implements IGetArtistByIdUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository
    ){}
    
    async execute(userId: string): Promise<Artist | null>{
    
        const user = await this._artistRepository.findById(userId)
    
        return user
    }
}