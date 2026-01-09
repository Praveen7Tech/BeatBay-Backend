import { IGetPlayListUseCase } from "../../../application/interfaces/usecase/playlist/get-playlist-usecase.interface";
import { PlayList } from "../../../domain/entities/playList.entiy";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";

 export class GetPlayListUseCase implements IGetPlayListUseCase{
    constructor(
        private readonly _mongoosePlayListRepository: IPlayListRepository
    ){}

    async execute(playListId: string): Promise<PlayList | null>{
        const playList = await this._mongoosePlayListRepository.findById(playListId)

        return playList
    }
 }