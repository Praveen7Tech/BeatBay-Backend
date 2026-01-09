import { Artist } from "../../../../domain/entities/arist.entity";

export interface IArtistDetailsUseCase {
    execute(artistId: string): Promise<Artist | null>;
}