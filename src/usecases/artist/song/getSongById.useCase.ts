import { IGetSongDetailsByIdUseCase } from "../../../application/interfaces/usecase/song/artist-getsong-detail-byid-usecase.interface";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ArtistSongDetailsMapper } from "../../../application/mappers/artist/song/song.details.mapper";
import { ArtistSongDetailsDTO } from "../../../application/dto/artist/song/artist.songDetails.dto";

export class GetSongDetailsByIdUseCase implements IGetSongDetailsByIdUseCase
{
  constructor(
    private readonly _songRepository: ISongRepository,
    private readonly _awsStorageService: IAWSS3StorageService
  ) {}

  async execute(songId: string): Promise<ArtistSongDetailsDTO> {
    const song = await this._songRepository.findById(songId);

    if (!song) {
      throw new NotFoundError("Song not found");
    }

    const [audioUrl, coverImageUrl, lyricsUrl] = await Promise.all([
      this._awsStorageService.getAccessPresignedUrl(song.audioKey),
      this._awsStorageService.getAccessPresignedUrl(song.coverImageKey),
      this._awsStorageService.getAccessPresignedUrl(song.lyricsKey),
    ]);

    return ArtistSongDetailsMapper.toDTO(song, {
      audioUrl,
      coverImageUrl,
      lyricsUrl,
    });
  }
}
