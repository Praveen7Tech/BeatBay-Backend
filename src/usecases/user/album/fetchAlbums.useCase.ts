import { FetchAlbumsResponseDTO } from "../../../application/dto/album/album.response.dto";
import { IFetchAlbumsUsecase } from "../../../application/interfaces/usecase/album/fetch-albums-usecase.interface";
import { FetchAlbumMapper } from "../../../application/mappers/album/fetch-album.mapper";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class FetchAlbumsUsecase implements IFetchAlbumsUsecase {
  constructor(
    private readonly _albumRepository: IAlbumRepository
  ) {}

  async execute(): Promise<FetchAlbumsResponseDTO> {
    const albums = await this._albumRepository.getAll();

    return {
      albums: FetchAlbumMapper.toDTOList(albums),
    };
  }
}
