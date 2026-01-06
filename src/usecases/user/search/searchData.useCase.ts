import { ISearchService } from "../../../domain/services/search.service";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { SearchResponseDTO } from "../../../application/dto/search/search.response.dto";
import { SearchMapper } from "../../../application/mappers/user/search/search.mapper";

export class UserGetSearchDataUseCase {
  constructor(
    private readonly _searchService: ISearchService,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(query: string): Promise<SearchResponseDTO> {
    const data = await this._searchService.unifiedSearch(query);
    const users = await this._userRepository.searchByName(query);

    return {
      topResult: SearchMapper.topResult(data.topResult),
      songs: data.songs.map(SearchMapper.song),
      albums: data.albums.map(SearchMapper.album),
      artists: data.artists.map(SearchMapper.artist),
      users: users?.map(SearchMapper.user) ?? []
    };
  }
}
