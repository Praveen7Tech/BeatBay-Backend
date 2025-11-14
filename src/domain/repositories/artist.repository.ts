import { ClientSession } from "mongoose";
import { Artist } from "../entities/arist.entity";
import { IBaseRepository } from "./base.repository";
import { Song } from "../entities/song.entity";

export interface IArtistRepository extends IBaseRepository<Artist> {
    addSongIdToArtist(artistId: string, songId: string, session: ClientSession): Promise<void>
    fetchSongs(artistId: string): Promise<Song[]>
}