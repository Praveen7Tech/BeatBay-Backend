
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class ToggleAlbumStatusUseCase {
    constructor(private readonly _albumRepository: IAlbumRepository) {}

    async execute(albumId: string, targetStatus: boolean): Promise<boolean> {
        console.log("damm ", albumId,targetStatus)
        const album = await this._albumRepository.updateStatus(albumId, targetStatus);
        
        if (!album) {
            throw new Error("SONG_NOT_FOUND");
        }

        return true;
    }
}