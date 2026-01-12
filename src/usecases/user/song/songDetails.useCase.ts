import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ISongDetailsUseCase } from "../../../application/interfaces/usecase/song/song-details-usecaase.interface";
import { ArtistDetails } from "../../../domain/entities/song.entity";
import { SongDetailsResponseDTO } from "../../../application/dto/song/song.response.dto";
import { SongDetailsMapper } from "../../../application/mappers/song/song-details.mapper";

function isArtistDetails(
  artist: string | ArtistDetails
): artist is ArtistDetails {
  return typeof artist === "object" && artist !== null && "_id" in artist;
}

export class SongDetailsUseCase implements ISongDetailsUseCase {
  constructor(
    private readonly _songRepository: ISongRepository,
    private readonly _recommendationService: IRecomentationService
  ) {}

  async execute( songId: string,userId: string ): Promise<SongDetailsResponseDTO> {

    const songResult = await this._songRepository.findById(songId, userId);

    if (!songResult?.song) {
      throw new NotFoundError("Song currently unavailable!");
    }

    const { song, isLiked } = songResult;

    if (!isArtistDetails(song.artistId) || !song.genre) {
      throw new Error("Recommendation logic failed");
    }

    const recommendationResults = await this._recommendationService.getRecomentedSongs
    (songId,song.artistId._id, song.genre, userId );

    return {
      song: SongDetailsMapper.toDTO(song, isLiked),
      recommendations: SongDetailsMapper.toDTOList(recommendationResults),
    };
  }
}
