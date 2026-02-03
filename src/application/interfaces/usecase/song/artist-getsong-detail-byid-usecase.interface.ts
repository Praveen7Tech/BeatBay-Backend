import { ArtistSongDetailsDTO } from "../../../dto/artist/song/artist.songDetails.dto";

export interface IGetSongDetailsByIdUseCase {
    execute(songId: string): Promise<ArtistSongDetailsDTO>;
}