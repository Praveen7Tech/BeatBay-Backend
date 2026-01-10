import { IArtistDetailsUseCase } from "../../../application/interfaces/usecase/artist-features/artist-details-usecase.interface";
import { Artist } from "../../../domain/entities/arist.entity";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class ArtistDetailsUseCase implements IArtistDetailsUseCase{
    constructor(
        private readonly _mongooseArtistRepository: IArtistRepository
    ){}

    async execute(artistId:string): Promise<Artist | null>{
        const artistDetails = await this._mongooseArtistRepository.findById(artistId)
        return artistDetails
    }
}