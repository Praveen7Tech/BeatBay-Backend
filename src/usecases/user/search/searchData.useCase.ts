import { ISearchService } from "../../../domain/services/search.service";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { SearchResponseDTO } from "../../../application/dto/search/search.response.dto";
import { SearchMapper } from "../../../application/mappers/user/search/search.mapper";
import { IUserGetSearchDataUseCase } from "../../../application/interfaces/usecase/search/user-get-search-data-usecase.interface";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";
import { PreparedSong } from "../../../application/dto/song/song.dto";

export class UserGetSearchDataUseCase implements IUserGetSearchDataUseCase{
  constructor(
    private readonly _searchService: ISearchService,
    private readonly _userRepository: IUserRepository,
    private readonly _awsStorageService: IAWSS3StorageService
  ) {}

  async execute(query: string): Promise<SearchResponseDTO> {
    const data = await this._searchService.unifiedSearch(query);
    const users = await this._userRepository.searchByName(query);

    // song with urls
    const preparedSongs: PreparedSong[] = await Promise.all(
      data.songs.map(async (song) => ({
        song,
        coverImageUrl: await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey),
        audioUrl: await this._awsStorageService.getAccessPresignedUrl(song.audioKey),
      }))
    );

    // prepare top result with url
    const preparedTopResult = data.topResult
      ? {
          song: data.topResult,
          coverImageUrl: await this._awsStorageService.getAccessPresignedUrl(
            data.topResult.coverImageKey
          ),
        }
      : null;

    return {
      topResult: SearchMapper.topResult(preparedTopResult),
      songs: preparedSongs.map(SearchMapper.song),
      albums: data.albums.map(SearchMapper.album),
      artists: data.artists.map(SearchMapper.artist),
      users: users?.map(SearchMapper.user) ?? []
    };
  }
}
