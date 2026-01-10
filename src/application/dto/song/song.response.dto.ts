import { Song } from "../../../domain/entities/song.entity";

export interface SongResponseDTO{
    songs: Song | null
    isLiked?: boolean
    recomentations: Song[] | []
}

export type SongHydrationResponseDTO = Song[];