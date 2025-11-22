import { IPlayListRepository } from "../../../domain/repositories/playList.repository";

export class AddToPlayListUseCase{
    constructor(
        private readonly mongoosePlayListRepository: IPlayListRepository
    ){}

    async execute(playListId: string, songId: string): Promise<boolean>{

        const updatedPlaylist = await this.mongoosePlayListRepository.update(playListId, songId)

        return true
    }
}