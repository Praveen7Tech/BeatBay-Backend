import { IArtistRepository } from "../../../domain/repositories/artist.repository"

export class BlockArtistUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(artistId: string): Promise<boolean>{
        const user = await this._artistRepository.blockById(artistId)

        return user 
    }
}