
import { IToggleAlbumStatusUseCase } from "../../../application/interfaces/usecase/admin/toggle-album-status-usecase.interface";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class ToggleAlbumStatusUseCase implements IToggleAlbumStatusUseCase{
    constructor(
        private readonly _albumRepository: IAlbumRepository
    ) {}

    async execute(albumId: string, targetStatus: boolean): Promise<boolean> {
        
        const album = await this._albumRepository.updateStatus(albumId, targetStatus);
        
        if (!album) {
            throw new Error("SONG_NOT_FOUND");
        }

        return true;
    }
}