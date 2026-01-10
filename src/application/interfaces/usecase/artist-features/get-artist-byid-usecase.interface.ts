import { Artist } from "../../../../domain/entities/arist.entity";

export interface IGetArtistByIdUseCase {
    execute(artistId: string): Promise<Artist | null>;
}