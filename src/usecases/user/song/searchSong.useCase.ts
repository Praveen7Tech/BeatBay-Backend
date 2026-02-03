import { SearchSongsDTO, SongResponseDTO } from "../../../application/dto/song/song.dto";
import { ISearchSongsUseCase } from "../../../application/interfaces/usecase/song/search-songs-usecaseinterface";
import { SearchSongMapper } from "../../../application/mappers/song/search-song.mapper";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";


export class SearchSongsUseCase implements ISearchSongsUseCase {
  constructor(
    private readonly _songRepository: ISongRepository, 
    private readonly _awsStorageService: IAWSS3StorageService
  ){}

  async execute({ query, limit = 20, offset = 0 }: SearchSongsDTO): Promise<SongResponseDTO[]> {
    const trimmed = query.trim();
    
    if (!trimmed) {
      return [];
    }

    const safeLimit = limit > 50 ? 50 : limit;
    const songs = await this._songRepository.searchByQuery(trimmed, {
      limit: safeLimit,
      offset,
    });

    const songsWithUrls = await Promise.all(
    songs.map(async (song) => {
      const coverImageUrl = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey);
        const audioUrl = await this._awsStorageService.getAccessPresignedUrl(song.audioKey);

        return {
          song,
          coverImageUrl,
          audioUrl,
        };
      })
    );

    return SearchSongMapper.toResponseDTOList(songsWithUrls);
  }
}