import { IGetSongDetailsByIdUseCase } from "../../../application/interfaces/usecase/song/artist-getsong-detail-byid-usecase.interface";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { ArtistSongDetailsMapper } from "../../../application/mappers/artist/song/song.details.mapper";
import { ArtistSongDetailsDTO } from "../../../application/dto/artist/song/artist.songDetails.dto";
import { IPlayRepository } from "../../../domain/repositories/play.repository";

export class GetSongDetailsByIdUseCase implements IGetSongDetailsByIdUseCase
{
  constructor(
    private readonly _songRepository: ISongRepository,
    private readonly _awsStorageService: IAWSS3StorageService,
    private readonly _playRepository: IPlayRepository
  ) {}

    private getFileNameFromKey(key: string): string {
      return key.split("/").pop() || "";
    }

  async execute(songId: string): Promise<ArtistSongDetailsDTO> {
    const song = await this._songRepository.findById(songId);

    if (!song) {
      throw new NotFoundError("Song not found");
    }

    const  coverImageUrl = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey)
    const audioUrl = this.getFileNameFromKey(song.audioKey)
    const lyricsUrl = this.getFileNameFromKey(song.lyricsKey)

    return ArtistSongDetailsMapper.toDTO(song, {
      audioUrl,
      coverImageUrl,
      lyricsUrl,
    });
  }
}
