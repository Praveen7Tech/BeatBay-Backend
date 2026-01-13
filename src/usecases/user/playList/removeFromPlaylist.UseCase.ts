import { IRemoveFromPlayListUseCase } from "../../../application/interfaces/usecase/playlist/remove-from-playlist-usecase.interface";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";

export class RemoveFromPlaylistUseCase implements IRemoveFromPlayListUseCase{
    constructor(
        private readonly _mongoosePlayListRepository: IPlayListRepository
    ){}

    async execute(playlistId: string, songId: string): Promise<boolean> {
        await this._mongoosePlayListRepository.removeSong(playlistId,songId)

        return true
    }
}