import { Song } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";

interface SearchSongsDTO {
  query: string;
  limit?: number;
  offset?: number;
}

export class SearchSongsUseCase {
  constructor(
    private readonly _mongooseSongRepository: ISongRepository,
  ){}

  async execute({ query, limit = 20, offset = 0 }: SearchSongsDTO): Promise<Song[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    if (limit > 50) limit = 50;

    return this._mongooseSongRepository.searchByQuery(trimmed, { limit, offset });
  }
}