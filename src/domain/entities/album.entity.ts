import { SongNew } from "./song.entity"

export interface Album{
    _id: string
    artistId:string
    artistName: string
    title: string
    description: string
    coverImageUrl: string
    coverImagePublicId: string
    songs: string[]
    songTitles: string[]
    isActive: boolean
    createdAt: Date;
    updatedAt: Date;
}

interface ExtendedSong extends SongNew{
    audioUrl?: string
    coverImageUrl?: string
}

export interface AlbumWithSongs extends Omit<Album, "songs">{
    songs: ExtendedSong[]
}