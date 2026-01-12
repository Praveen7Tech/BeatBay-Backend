import { PlayListEditDTO } from "../../../application/dto/playList/edit.playlist.dto";
import { IGetPlayListEditUseCase } from "../../../application/interfaces/usecase/playlist/get-playlist-edit.usecase.interface";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";

export class GetPlayListEditUseCase implements IGetPlayListEditUseCase {
  constructor(
    private readonly _playListRepository: IPlayListRepository
  ) {}

  async execute(playListId: string): Promise<PlayListEditDTO | null> {
    const playlist = await this._playListRepository.getDetails(playListId);

    if (!playlist) return null;

    return {
      id: playlist.id.toString(),
      coverImagePublicId: playlist.coverImagePublicId
    };
  }
}
