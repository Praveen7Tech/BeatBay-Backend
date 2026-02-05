import { SongPerformanceDTO } from "../../../application/dto/artist/song/song.performance.dto";
import { IGetSongPerformanceUseCase } from "../../../application/interfaces/usecase/song/artist-song-perfomance-usecase.interface";
import { IPlayRepository } from "../../../domain/repositories/play.repository";

export class GetSongPerformanceUseCase implements IGetSongPerformanceUseCase {

  constructor(
    private readonly _playRepository: IPlayRepository
  ) {}

  async execute( songId: string, days: number): Promise<SongPerformanceDTO[]> {

        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - days);

        const isYear = days >= 365;

        const raw = await this._playRepository.getSongPerformance(songId,from, to,
        isYear ? "%Y-%m" : "%Y-%m-%d" );

        const playMap = new Map<string, number>(raw.map(r => [r.label, r.count]));

        const result: SongPerformanceDTO[] = [];
        const cursor = new Date(from);

        while (cursor <= to) {
            let key: string;

            if (isYear) {
                key = cursor.toISOString().slice(0, 7);
                cursor.setMonth(cursor.getMonth() + 1);
            } else {
                key = cursor.toISOString().slice(0, 10);
                cursor.setDate(cursor.getDate() + 1);
            }

            result.push({
                label: key,
                streams: playMap.get(key) ?? 0
            });
        }

        return result;
    }
}
