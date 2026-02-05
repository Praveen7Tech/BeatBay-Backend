import { ITrachSongPlayUseCase } from "../../../application/interfaces/usecase/song/trachSongPlays-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistDailyAnalyticsRepository } from "../../../domain/repositories/artist.daily.analytics.repository";
import { IPlayRepository } from "../../../domain/repositories/play.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class TrackSongPlaysUseCase implements ITrachSongPlayUseCase{
    constructor(
        private readonly _playRepository: IPlayRepository,
        private readonly _songRepository: ISongRepository,
        private readonly _mongooseAlbumRepository: IAlbumRepository,
        private readonly _dailyAnalyticsRepository: IArtistDailyAnalyticsRepository
    ){}

    async execute(userId: string, songId: string): Promise<void> {

        const today = new Date().toISOString().split("T")[0];

        const song = await this._songRepository.findById(songId);
        if (!song) throw new NotFoundError("Song not found");
        const artistId = song.artistId

        // Use song duration for the cooling period
        // If song is 180s, don't allow another play for 180s.
        const coolingPeriod = new Date(Date.now() - (song.duration * 1000));
        
        const recentPlay = await this._playRepository.recentPlay(userId, songId, coolingPeriod);
        if (recentPlay) return;

        // 2. Register the legitimate play
        await this._playRepository.create(userId, songId, artistId, new Date());

        // 3. Update song/album play count
        await this._songRepository.updatePlayCount(songId);
        await this._mongooseAlbumRepository.updateSongPlayCount(songId)

        // icrement daily analytics
        await this._dailyAnalyticsRepository.incrementField(artistId,today,"streams",1)
    }

}