import { Artist } from "../../../domain/entities/arist.entity"
import { IArtistRepository } from "../../../domain/repositories/artist.repository"

export class GetArtistByIdUseCase{
    constructor(
        private readonly artistRepository: IArtistRepository
    ){}
    
    async execute(userId: string): Promise<Artist | null>{
    
        const user = await this.artistRepository.findById(userId)
    
        return user
    }
}