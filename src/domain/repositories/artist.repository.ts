import { ClientSession } from "mongoose";
import { Artist } from "../entities/arist.entity";
import { IBaseRepository } from "./base.repository";
import { Song } from "../entities/song.entity";
import { ArtistPopulated } from "../interfaces/albumRequest";
import { DemoGraphics } from "../../application/dto/admin/dashboard/dashboard.dto";

export interface IArtistRepository extends IBaseRepository<Artist> {
    addSongIdToArtist(artistId: string, songId: string, session: ClientSession): Promise<void>
    fetchSongs(artistId: string): Promise<Song[]>
    addAlbumIdToArtist(artistId:string, albumId: string, session: ClientSession): Promise<void>
    fetchAlbums(artistId: string): Promise<string[]>
    removeSongIdFromArtist(artistId: string, songId:string, session: ClientSession): Promise<void>
    removeAlbumIdFromArtist(artistId: string, albumId:string, session: ClientSession): Promise<void>
    findArtistDetailsById(id: string): Promise<ArtistPopulated | null>;
   // getArtistStatistics(startDate:Date): Promise<DemoGraphics[]>
}