import { PlayListResponseDTO } from "../../../application/dto/playList/request.dto";
import { IGetPlayListUseCase } from "../../../application/interfaces/usecase/playlist/get-playlist-usecase.interface";
import { PlayListMapper } from "../../../application/mappers/playlist.mapper";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

export class GetPlayListUseCase implements IGetPlayListUseCase {
  constructor(
    private readonly _playListRepository: IPlayListRepository,
      private readonly _awsStorageService: IAWSS3StorageService
  ) {}

  async execute(playListId: string): Promise<PlayListResponseDTO | null> {
    const playList = await this._playListRepository.findById(playListId);

    if (!playList) return null;
    
    const preparedSongs = await Promise.all(
      playList.songs.map(async (song) => {

        const coverImageUrl = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey);
        const audioUrl = await this._awsStorageService.getAccessPresignedUrl( song.audioKey);

        return {
          song,
          coverImageUrl,
          audioUrl,
        };
      })
    );

    return PlayListMapper.toResponse(playList,preparedSongs);
  }
}
