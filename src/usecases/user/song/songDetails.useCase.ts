import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ISongDetailsUseCase } from "../../../application/interfaces/usecase/song/song-details-usecaase.interface";
import { ArtistDetails } from "../../../domain/entities/song.entity";
import { SongDetailsResponseDTO } from "../../../application/dto/song/song.response.dto";
import { SongDetailsMapper } from "../../../application/mappers/song/song-details.mapper";
import { IMongooseLikesRepository } from "../../../domain/repositories/Likes.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";

function isArtistDetails(
  artist: string | ArtistDetails
): artist is ArtistDetails {
  return typeof artist === "object" && artist !== null && "_id" in artist;
}

export class SongDetailsUseCase implements ISongDetailsUseCase {
  constructor(
    private readonly _songRepository: ISongRepository,
    private readonly _mongoosesongLikesRepository: IMongooseLikesRepository,
    private readonly _recommendationService: IRecomentationService,
    private readonly _awsStorageService: IAWSS3StorageService
  ) {}

  async execute( songId: string,userId: string ): Promise<SongDetailsResponseDTO> {

    const song = await this._songRepository.findById(songId);
    if (!song) {
      throw new NotFoundError("Song currently unavailable!");
    }

    const [audioUrl, coverImageUrl, lyricsUrl] = await Promise.all([
      this._awsStorageService.getAccessPresignedUrl(song.audioKey),
      this._awsStorageService.getAccessPresignedUrl(song.coverImageKey),
      this._awsStorageService.getAccessPresignedUrl(song.lyricsKey  )
    ])

    const urls = {
      audioUrl,
      coverImageUrl,
      lyricsUrl
    }

    const isLiked = userId ? await this._mongoosesongLikesRepository.isSongLiked(userId,songId) : false

    if (!isArtistDetails(song.artistId) || !song.genre) {
      throw new Error("Recommendation logic failed");
    }

    const recommendationResults = await this._recommendationService.getRecomentedSongs(songId,song.artistId._id, song.genre, userId );

    const recomentationsWithUrls = await Promise.all(
      recommendationResults.map(async(item)=>{
        const [recAudio, recCover] = await Promise.all([
          this._awsStorageService.getAccessPresignedUrl(item.song.audioKey),
          this._awsStorageService.getAccessPresignedUrl(item.song.coverImageKey)
        ])

        return {
          song:item.song,
          isLiked:item.isLiked,
          urls:{
            audioUrl: recAudio,
            coverImageUrl: recCover,
          }
        }
      })
    )

    return {
      song: SongDetailsMapper.toDTO(song, isLiked, urls),
      recommendations: SongDetailsMapper.toRecommendedDTOList(recomentationsWithUrls),
    };
  }
}
