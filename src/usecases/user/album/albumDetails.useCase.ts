import { AlbumDetailsResponseDTO } from "../../../application/dto/album/album.response.dto";
import { IAlbumDetailsUseCase } from "../../../application/interfaces/usecase/album/album-details-usecase.interface";
import { AlbumMapper } from "../../../application/mappers/album/album-details.mapper";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IMongooseLikesRepository } from "../../../domain/repositories/Likes.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";


export class AlbumDetailsUseCase implements IAlbumDetailsUseCase {
  constructor(
    private readonly _mongooseAlbumRepository: IAlbumRepository,
    private readonly _mongoosesongLikesRepository: IMongooseLikesRepository,
    private readonly _awsStorageService: IAWSS3StorageService
  ) {}

  async execute(albumId: string, userId:string): Promise<AlbumDetailsResponseDTO> {
    const album = await this._mongooseAlbumRepository.findById(albumId);

    if (!album) {
      throw new NotFoundError("Album currently not available");
    }

    const songsWithUrls = await Promise.all(
      album.songs.map(async (song) => {
        const [signedCover, signedAudio] = await Promise.all([
          this._awsStorageService.getAccessPresignedUrl(song.coverImageKey),
          this._awsStorageService.getAccessPresignedUrl(song.audioKey),
        ]);
        
        return {
          ...song,
          coverImageUrl: signedCover,
          audioUrl: signedAudio,
        };
      })
    );

    //  updated songs back to the album object
    const albumWithSignedData = { ...album, songs: songsWithUrls };

    const songIds = album.songs.map((song)=> song._id.toString())

    const likedSongIds = await this._mongoosesongLikesRepository.findLikedSongIds(userId,songIds)

    return AlbumMapper.toAlbumDetails(albumWithSignedData,likedSongIds);
  }
}
