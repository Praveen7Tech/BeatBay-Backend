import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { UploadSongDTO } from "../../../application/dto/song/song.dto";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IUploadSongUseCase } from "../../../application/interfaces/usecase/song/artist-upload-song-usecase.interface";
import { SongNew } from "../../../domain/entities/song.entity";
import { IArtistDailyAnalyticsRepository } from "../../../domain/repositories/artist.daily.analytics.repository";
import { IJobQueueService } from "../../../domain/services/notification/job-queue.service";
import logger from "../../../infrastructure/utils/logger/logger";

export class UploadSongUseCase implements IUploadSongUseCase{
    constructor(
        private readonly _songRepository: ISongRepository,
        private readonly _artistRepository: IArtistRepository,
        private readonly _transactionManager: ITransactionManager,
        private readonly _dailyAnalyticsRepository: IArtistDailyAnalyticsRepository,
        private readonly _jobQueuService: IJobQueueService
    ){}

    async execute(artistId:string,request: UploadSongDTO): Promise<{success: boolean}>{

        const today = new Date().toISOString().split("T")[0];
        let artistName;

        await this._transactionManager.withTransaction(async(session)=>{

            const artist = await this._artistRepository.findById(artistId)
            if(!artist){
                throw new NotFoundError("Artist not found")
            }
            artistName = artist.name
            
            const songData: Partial<SongNew> = {
                uploadId: request.uploadId,
                title: request.title,
                description:request.description,
                genre:request.genre,
                tags:request.tags,
                
                audioKey:request.trackKey,
                coverImageKey: request.coverKey,
                lyricsKey: request.lyricsKey,
                
                artistId:artistId,
                artistName: artist?.name,
                status: true,
                duration: request.duration
            }
        const newSong = await this._songRepository.create(songData as SongNew, session)

        await this._artistRepository.addSongIdToArtist(artistId, newSong._id, session)

        // analytics update
        await this._dailyAnalyticsRepository.incrementField(artistId,today,"songs",1)

        })

        const message = `${artistName} uploaded  a new song ${request.title}`
 
        // set notitification job queue
        await this._jobQueuService.addNotificationJob(artistId,message)

        return {success: true}
        
    }
}