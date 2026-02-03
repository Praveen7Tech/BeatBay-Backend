import { PaginatedSongResponse } from "../../../application/dto/admin/songs/song-listing.dto";
import { PreparedAdminSong } from "../../../application/dto/song/song.dto";
import { IGetAllSongsUseCase } from "../../../application/interfaces/usecase/admin/get-all-song-usecse.interface";
import { AdminSongMapper } from "../../../application/mappers/admin/song/song.mapper";
import { GetAllSongsRequest } from "../../../domain/interfaces/songRequest";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";


export class GetAllSongsUseCase implements IGetAllSongsUseCase{
    constructor(
        private readonly _songRepository: ISongRepository,
        private readonly _awsStorageService: IAWSS3StorageService
    ) {}

    async execute(request: GetAllSongsRequest): Promise<PaginatedSongResponse> {
        const { page, limit } = request;
        const { songs, total } = await this._songRepository.admingetAllSongs(request);

        const preparedSongs: PreparedAdminSong[] = await Promise.all(
            songs.map(async (song) => ({
            ...song,
            coverImageUrl: await this._awsStorageService.getAccessPresignedUrl(
                song.coverImageKey
            ),
            }))
        );

        // Map to DTO
         return {
            songs: AdminSongMapper.toListItemDTOs(preparedSongs),
            totalCount: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
}
