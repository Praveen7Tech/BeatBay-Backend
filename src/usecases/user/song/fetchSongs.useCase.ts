import { FetchSongsResponseDTO } from "../../../application/dto/song/song.response.dto";
import { IFetchSongsUsecase } from "../../../application/interfaces/usecase/song/fetch-songs-usecase.interface";
import { FetchSongMapper } from "../../../application/mappers/song/fetch-song.mapper";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

export class FetchSongsUsecase implements IFetchSongsUsecase {
  constructor(
    private readonly _songRepository: ISongRepository,
    private readonly _awsStorageService: IAWSS3StorageService
  ) {}

  async execute(): Promise<FetchSongsResponseDTO> {
    const songs = await this._songRepository.getAll();

    const songWithUrls = await Promise.all(
      songs.map(async(song)=>{
        const coverImageUrl = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey)

        return{song, coverImageUrl}
      })
    )
    return {
      songs: FetchSongMapper.toDTOList(songWithUrls),
    };
  }
}
