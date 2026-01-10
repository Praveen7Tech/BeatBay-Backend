import { IUnBlockArtistUseCase } from "../../../application/interfaces/usecase/admin/unblock-artist-usecase.interface";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class UnBlockUArtistUseCase implements IUnBlockArtistUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(artistId: string): Promise<boolean>{

        const user = await this._artistRepository.unBlockById(artistId)

        return user
    }
}