import { AdminSongDetailsDTO } from "../../../application/dto/admin/songs/songDetails.dto";
import { IAdminGetSongDetailsByIdUseCase } from "../../../application/interfaces/usecase/admin/get-songdetails-byid-usecase.interface";
import { AdminSongDetailsMapper } from "../../../application/mappers/admin/song/songDetails.mapper";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";
export class AdminGetSongDetailsByIdUseCase implements IAdminGetSongDetailsByIdUseCase
{
  constructor(
    private readonly _songRepository: ISongRepository,
    private readonly _awsStorageService: IAWSS3StorageService
  ) {}

  async execute(songId: string): Promise<AdminSongDetailsDTO | null> {
    const song = await this._songRepository.adminfindById(songId);

    if (!song) return null;

    const coverImageUrl = await this._awsStorageService.getAccessPresignedUrl(song.coverImageKey);

    return AdminSongDetailsMapper.toDTO(song, coverImageUrl);
  }
}
