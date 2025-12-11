
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { AlbumDetailsDTO } from "../../dto/album/album.response.dto";
import { NotFoundError } from "../../../common/errors/common/common.errors";

export class GetAlbumDetailsByIdUseCase{
    constructor(
        private readonly _albumRepository: IAlbumRepository
    ){}

    async execute(albumId: string): Promise<AlbumDetailsDTO>{

        const album = await this._albumRepository.findById(albumId)
        if(!album){
            throw new NotFoundError("album not found")
        }

        const songFormat = album.songs?.map((s: any) => ({
            id: typeof s === "string" ? s : s._id,
            title: typeof s === "string" ? "" : s.title,
            coverImageUrl: typeof s === "string" ? "" : s.coverImageUrl
        })) ?? [];

        const albumFormat: AlbumDetailsDTO = {
            id: album._id,
            title: album.title,
            description: album.description,
            coverImageUrl: album.coverImageUrl,
            songs: songFormat
        }

        return albumFormat
    }
}