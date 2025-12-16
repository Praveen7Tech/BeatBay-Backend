import { NotFoundError } from "../../../common/errors/common/common.errors";
import { PlayList } from "../../../domain/entities/playList.entiy";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { PlayListEditRequestDTO } from "../../../application/dto/playList/request.dto";

export class EditPlayListUseCase{
    constructor(
        private readonly _mongoosePlayListRepository: IPlayListRepository
    ){}

    async execute(playListId: string, data:PlayListEditRequestDTO): Promise<PlayList | null>{
        const updatedPlaylist = await this._mongoosePlayListRepository.edit(playListId, data);

        if (!updatedPlaylist) {
             throw new NotFoundError("Playlist not found or update failed.");
        }

        return updatedPlaylist;
    }
}