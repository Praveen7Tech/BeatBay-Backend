import { IArtistRepository } from "../../../domain/repositories/artist.repository"

export class BlockArtistUseCase{
    constructor(
        private readonly artistRepository: IArtistRepository
    ){}

    async execute(artistId: string): Promise<boolean>{
        const user = await this.artistRepository.blockById(artistId)

        return user 
    }
}