
import { ClientSession } from "mongoose";
import { Song } from "../entities/song.entity";

export interface CreateSongData {
    title: string;
    genre: string;
    audioUrl: string; 
    coverImageUrl: string; 
    description?: string;
    tags?: string;
    album?: string;
    lyrics?: string;
    lyricsUrl?: string;
    releaseDate?: string; 
    artistId: string; 
}

export interface ISongRepository {
    create(songData: CreateSongData, session?:ClientSession): Promise<Song>;
    getAll(): Promise<Song[]>
}
