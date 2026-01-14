import { AlbumDetailsResponseDTO } from "../../../dto/album/album.response.dto";

export interface IAlbumDetailsUseCase {
    execute(albumId: string, userId:string): Promise<AlbumDetailsResponseDTO>
}