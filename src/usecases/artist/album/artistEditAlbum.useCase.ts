import { partial } from "zod/v4/core/util.cjs";
import { Album } from "../../../domain/entities/album.entity";
import { da } from "zod/v4/locales";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { ForbiddenError, NotFoundError } from "../../../common/errors/common/common.errors";
import { CreateAlbumDTO } from "../../dto/album/album.dto";
import { dot } from "node:test/reporters";
import { success } from "zod";

export class EditAlbumUseCase{
    constructor(
        private readonly transactionManager: ITransactionManager,
        private readonly albumRepository: IAlbumRepository
    ){}

    async execute(artistId: string, albumId:string, data: Partial<CreateAlbumDTO>): Promise<{success:boolean}>{

       await  this.transactionManager.withTransaction(async(session)=>{
           
           const album = await this.albumRepository.find(albumId)
           
           if(!album) throw new NotFoundError("album not found")
           
           if(album.artistId.toString() !== artistId)  throw new ForbiddenError()

           const updatedData : Partial<CreateAlbumDTO> = {}
           if (data.title) updatedData.title = data.title;
            if (data.description) updatedData.description = data.description;

            if (data.coverImageUrl) {
                updatedData.coverImageUrl = data.coverImageUrl;
            }

            if (data.songs) {
                updatedData.songs = [...data.songs];
            }

            await this.albumRepository.updateById(albumId, updatedData, session)

       })

       return {success: true}
    }
}