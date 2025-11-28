import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class UnBlockUArtistUseCase{
    constructor(
        private readonly artistRepository: IArtistRepository
    ){}

    async execute(artistId: string): Promise<boolean>{

        const user = await this.artistRepository.unBlockById(artistId)

        return user
    }
}