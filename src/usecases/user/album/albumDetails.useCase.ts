import { AlbumDetailsResponseDTO } from "../../../application/dto/album/album.response.dto";
import { IAlbumDetailsUseCase } from "../../../application/interfaces/usecase/album/album-details-usecase.interface";
import { AlbumMapper } from "../../../application/mappers/album/album-details.mapper";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";


export class AlbumDetailsUseCase implements IAlbumDetailsUseCase {
  constructor(
    private readonly _mongooseAlbumRepository: IAlbumRepository
  ) {}

  async execute(albumId: string): Promise<AlbumDetailsResponseDTO> {
    const albumDetails = await this._mongooseAlbumRepository.findById(albumId);

    if (!albumDetails) {
      throw new NotFoundError("Album currently not available");
    }

    return AlbumMapper.toAlbumDetails(albumDetails);
  }
}
