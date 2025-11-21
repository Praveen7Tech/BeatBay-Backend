import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { CreatePlayListResponseDTO } from "../../dto/playList/request.dto";

export class CreatePlayListUseCase{
    constructor(
        private readonly mongoosePlayListRepository: IPlayListRepository
    ){}

    async execute(): Promise<CreatePlayListResponseDTO>{
        const palyListName = "My PlayList"
        const newPlaylist = await this.mongoosePlayListRepository.create(palyListName)

        return {
            id:newPlaylist._id.toString(),
            name:newPlaylist.name}
    }
}