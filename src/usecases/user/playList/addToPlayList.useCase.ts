import { IAddToPlayListUseCase } from "../../../application/interfaces/usecase/playlist/add-to-playlist-usecase.interface";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";

export class AddToPlayListUseCase implements IAddToPlayListUseCase{
    constructor(
        private readonly _mongoosePlayListRepository: IPlayListRepository
    ){}

    async execute(playListId: string, songId: string): Promise<boolean>{

        await this._mongoosePlayListRepository.update(playListId, songId)

        return true
    }
}