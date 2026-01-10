import { ArtistAlbumsResponseDTO } from "../../../dto/album/album.response.dto";

export interface IArtistGetAlbumsUseCase {
    execute(artistId: string): Promise<ArtistAlbumsResponseDTO>;
}