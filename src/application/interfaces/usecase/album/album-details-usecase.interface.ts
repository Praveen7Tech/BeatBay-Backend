import { Album } from "../../../../domain/entities/album.entity";

export interface IAlbumDetailsUseCase {
    execute(albumId: string): Promise<Album>;
}