import { IAddToPlayListUseCase } from "../../../application/interfaces/usecase/playlist/add-to-playlist-usecase.interface";
import { AlreadyExistError } from "../../../common/errors/common/common.errors";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";

export class AddToPlayListUseCase implements IAddToPlayListUseCase{
    constructor(
        private readonly _mongoosePlayListRepository: IPlayListRepository
    ){}

    async execute(playListId: string, songId: string): Promise<boolean>{

        const result = await this._mongoosePlayListRepository.update(playListId, songId)
        if(!result){
            throw new AlreadyExistError("song already exist in playlist.")
        }

        return true
    }
}