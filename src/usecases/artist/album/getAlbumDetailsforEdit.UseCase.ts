import { EditAlbumDetailsDTO } from "../../../application/dto/album/album.dto";
import { IAlbumDetailsEditUseCase } from "../../../application/interfaces/usecase/album/get-albumdetails-edit-usecase.interface";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";

export class GetAbumDetailsEditUseCase implements IAlbumDetailsEditUseCase{
    constructor(
        private readonly _albumRepository: IAlbumRepository
    ){}

    async execute(albumId: string): Promise<EditAlbumDetailsDTO | null> {
        const album = await this._albumRepository.getDetails(albumId);

        if (!album) return null;

        return {
        id: album.id.toString(),
        coverImagePublicId: album.coverImagePublicId
        };
    }
}