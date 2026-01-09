import { Album } from "../../../../domain/entities/album.entity";

export interface IFetchAlbumsUsecase {
    execute(): Promise<Album[]>;
}