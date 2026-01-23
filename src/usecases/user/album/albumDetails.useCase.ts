import { AlbumDetailsResponseDTO } from "../../../application/dto/album/album.response.dto";
import { IAlbumDetailsUseCase } from "../../../application/interfaces/usecase/album/album-details-usecase.interface";
import { AlbumMapper } from "../../../application/mappers/album/album-details.mapper";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IMongooseLikesRepository } from "../../../domain/repositories/Likes.repository";


export class AlbumDetailsUseCase implements IAlbumDetailsUseCase {
  constructor(
    private readonly _mongooseAlbumRepository: IAlbumRepository,
    private readonly _mongoosesongLikesRepository: IMongooseLikesRepository,
  ) {}

  async execute(albumId: string, userId:string): Promise<AlbumDetailsResponseDTO> {
    const album = await this._mongooseAlbumRepository.findById(albumId);

    if (!album) {
      throw new NotFoundError("Album currently not available");
    }

    const songIds = album.songs.map((song)=> song._id.toString())

    const likedSongIds = await this._mongoosesongLikesRepository.findLikedSongIds(userId,songIds)

    return AlbumMapper.toAlbumDetails(album,likedSongIds);
  }
}
