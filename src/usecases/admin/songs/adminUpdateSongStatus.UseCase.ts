import { IToggleSongStatusUseCase } from "../../../application/interfaces/usecase/admin/toggle-song-status-usecase.interface";
import { SongNew } from "../../../domain/entities/song.entity";
import { ISongRepository } from "../../../domain/repositories/song.repository";

export class ToggleSongStatusUseCase implements IToggleSongStatusUseCase{
    constructor(
        private readonly _songRepository: ISongRepository
    ) {}

    async execute(songId: string, targetStatus: boolean): Promise<SongNew> {
        
        const song = await this._songRepository.updateStatus(songId, targetStatus);
        
        if (!song) {
            throw new Error("SONG_NOT_FOUND");
        }

        return song;
    }
}