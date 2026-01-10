import { ArtistTableResponseDTO } from "../../../dto/admin/admin.response.dto";

export interface IFetchAllArtistsUseCase {
    execute(page: number, limit: number, search: string): Promise<ArtistTableResponseDTO>;
}