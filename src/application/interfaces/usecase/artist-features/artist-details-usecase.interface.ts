import { ArtistDetailsResponseDTO } from "../../../dto/artist/artist.profile.dto";

export interface IArtistDetailsUseCase {
    execute(artistId: string): Promise<ArtistDetailsResponseDTO | null>;
}