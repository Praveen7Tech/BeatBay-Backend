import { Song } from "../../../domain/entities/song.entity";

export interface SongResponseDTO{
    songs: Song | null
    recomentations: Song[] | []
}

export type SongHydrationResponseDTO = Song[];