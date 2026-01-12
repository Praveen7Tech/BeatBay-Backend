import { PlayListResponseDTO } from "../../../application/dto/playList/request.dto";
import { IGetPlayListUseCase } from "../../../application/interfaces/usecase/playlist/get-playlist-usecase.interface";
import { PlayListMapper } from "../../../application/mappers/playlist.mapper";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";

export class GetPlayListUseCase implements IGetPlayListUseCase {
  constructor(
    private readonly _playListRepository: IPlayListRepository
  ) {}

  async execute(playListId: string): Promise<PlayListResponseDTO | null> {
    const playList = await this._playListRepository.findById(playListId);

    if (!playList) return null;

    return PlayListMapper.toResponse(playList);
  }
}
