import { ITrachSongPlayUseCase } from "../../../application/interfaces/usecase/song/trachSongPlays-usecase.interface";
import { IPlayRepository } from "../../../domain/repositories/play.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class TrackSongPlaysUseCase implements ITrachSongPlayUseCase{
    constructor(
        private readonly _playRepository: IPlayRepository,
        private readonly _songRepository: ISongRepository
    ){}

    async execute(userId: string, songId: string, artistId: string): Promise<void> {
        
        const currentDate = new Date(Date.now() - 30000)
        // check the user already played the songs in the last 30 seconds
        const recentPlay =await this._playRepository.recentPlay(userId,songId,currentDate)

        if(recentPlay) return;

        const newDate = new Date()
        // create new play
        await this._playRepository.create(userId, songId, artistId,newDate )

        // update song count
        await this._songRepository.updatePlayCount(songId)
    }
}