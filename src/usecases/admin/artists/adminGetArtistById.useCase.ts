import { Artist } from "../../../domain/entities/arist.entity"
import { IArtistRepository } from "../../../domain/repositories/artist.repository"

export class GetArtistByIdUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository
    ){}
    
    async execute(userId: string): Promise<Artist | null>{
    
        const user = await this._artistRepository.findById(userId)
    
        return user
    }
}