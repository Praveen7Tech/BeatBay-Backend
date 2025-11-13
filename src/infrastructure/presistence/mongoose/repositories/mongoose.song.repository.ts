import { Song } from "../../../../domain/entities/song.entity";
import { CreateSongData, ISongRepository } from "../../../../domain/repositories/song.repository";
import { SongModel } from "../models/song.model";

export class MongooseSongRepository implements ISongRepository{
    async create(songData: CreateSongData): Promise<Song> {
        const Song = new SongModel(songData)

        const cretedSong = await Song.save()
        return cretedSong.toObject()
    }
}