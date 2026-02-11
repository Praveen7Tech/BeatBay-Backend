
import { ArtistProfileDTO } from "../../../dto/admin/artist/artist.profile.dto";

export interface IGetArtistByIdUseCase {
    execute(artistId: string): Promise<ArtistProfileDTO>;
}