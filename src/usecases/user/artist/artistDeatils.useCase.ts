import { Artist } from "../../../domain/entities/arist.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class ArtistDetailsUseCase{
    constructor(
        private readonly mongooseArtistRepository: IArtistRepository
    ){}

    async execute(artistId:string): Promise<Artist | null>{
        const artistDetails = await this.mongooseArtistRepository.findById(artistId)
        console.log("artist ",artistDetails)
        return artistDetails
    }
}