import { FetchSongsResponseDTO } from "../../../application/dto/song/song.response.dto";
import { IFetchSongsUsecase } from "../../../application/interfaces/usecase/song/fetch-songs-usecase.interface";
import { FetchSongMapper } from "../../../application/mappers/song/fetch-song.mapper";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class FetchSongsUsecase implements IFetchSongsUsecase {
  constructor(
    private readonly _songRepository: ISongRepository
  ) {}

  async execute(): Promise<FetchSongsResponseDTO> {
    const songs = await this._songRepository.getAll();

    return {
      songs: FetchSongMapper.toDTOList(songs),
    };
  }
}
