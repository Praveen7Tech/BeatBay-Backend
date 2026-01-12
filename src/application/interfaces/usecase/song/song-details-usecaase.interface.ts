import { SongDetailsResponseDTO } from "../../../dto/song/song.response.dto";

export interface ISongDetailsUseCase {
    execute(songId: string, userId: string): Promise<SongDetailsResponseDTO>;
}