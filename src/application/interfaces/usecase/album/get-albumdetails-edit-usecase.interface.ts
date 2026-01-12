import { EditAlbumDetailsDTO } from "../../../dto/album/album.dto";

export interface IAlbumDetailsEditUseCase{
    execute(albumId:string): Promise<EditAlbumDetailsDTO | null>
}