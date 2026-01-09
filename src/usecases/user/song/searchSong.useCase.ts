import { SearchSongsDTO } from "../../../application/dto/song/song.dto";
import { ISearchSongsUseCase } from "../../../application/interfaces/usecase/song/search-songs-usecaseinterface";
import { Song } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";


export class SearchSongsUseCase implements ISearchSongsUseCase {
  constructor(
    private readonly _songRepository: ISongRepository, 
  ){}

  async execute({ query, limit = 20, offset = 0 }: SearchSongsDTO): Promise<Song[]> {
    const trimmed = query.trim();
    
    if (!trimmed) {
      return [];
    }

    const safeLimit = limit > 50 ? 50 : limit;

    return this._songRepository.searchByQuery(trimmed, { limit: safeLimit, offset });
  }
}