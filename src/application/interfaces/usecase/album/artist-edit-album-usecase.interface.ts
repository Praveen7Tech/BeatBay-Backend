import { CreateAlbumDTO } from "../../../dto/album/album.dto";

export interface IEditAlbumUseCase {
    execute(artistId: string, albumId: string, data: Partial<CreateAlbumDTO>): Promise<{ success: boolean }>;
}