import { IDeletePlayListUseCase } from "../../../application/interfaces/usecase/playlist/delete-playlist-usecase.interface";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";

export class DeletePlayListUseCase implements IDeletePlayListUseCase{
    constructor(
        private readonly _mongoosePlayListRepository: IPlayListRepository
    ){}

    async execute(playlistId: string): Promise<boolean> {
        const playlist = await this._mongoosePlayListRepository.delete(playlistId)

        return playlist
    }
}