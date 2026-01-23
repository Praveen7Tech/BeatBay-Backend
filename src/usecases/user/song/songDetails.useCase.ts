import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ISongDetailsUseCase } from "../../../application/interfaces/usecase/song/song-details-usecaase.interface";
import { ArtistDetails } from "../../../domain/entities/song.entity";
import { SongDetailsResponseDTO } from "../../../application/dto/song/song.response.dto";
import { SongDetailsMapper } from "../../../application/mappers/song/song-details.mapper";
import { IMongooseLikesRepository } from "../../../domain/repositories/Likes.repository";

function isArtistDetails(
  artist: string | ArtistDetails
): artist is ArtistDetails {
  return typeof artist === "object" && artist !== null && "_id" in artist;
}

export class SongDetailsUseCase implements ISongDetailsUseCase {
  constructor(
    private readonly _songRepository: ISongRepository,
    private readonly _mongoosesongLikesRepository: IMongooseLikesRepository,
    private readonly _recommendationService: IRecomentationService
  ) {}

  async execute( songId: string,userId: string ): Promise<SongDetailsResponseDTO> {

    const song = await this._songRepository.findById(songId);

    if (!song) {
      throw new NotFoundError("Song currently unavailable!");
    }

    const isLiked = userId ? await this._mongoosesongLikesRepository.isSongLiked(userId,songId) : false

    if (!isArtistDetails(song.artistId) || !song.genre) {
      throw new Error("Recommendation logic failed");
    }

    const recommendationResults = await this._recommendationService.getRecomentedSongs(songId,song.artistId._id, song.genre, userId );

    return {
      song: SongDetailsMapper.toDTO(song, isLiked),
      recommendations: SongDetailsMapper.toDTOList(recommendationResults),
    };
  }
}
