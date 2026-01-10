import { CreateAlbumDTO } from "../../../dto/album/album.dto";

export interface IArtistCreateAlbumUseCase{
    execute(artistId: string,request: CreateAlbumDTO): Promise<{ success: boolean }>
}