import { ClientSession } from "mongoose";
import { Song } from "../../../../domain/entities/song.entity";
import { CreateSongData, ISongRepository } from "../../../../domain/repositories/song.repository";
import { SongModel } from "../models/song.model";

export class MongooseSongRepository implements ISongRepository{
    async create(songData: CreateSongData, session?:ClientSession): Promise<Song> {
        const Song = new SongModel(songData)

        const cretedSong = await Song.save({session})
        return cretedSong.toObject() 
    }

    async getAll(): Promise<Song[]> {
        const songs = await SongModel.find()
        return songs
    }

    async findById(id: string): Promise<Song | null> {
        return SongModel.findById(id).populate({
            path:'artistId',
            select: 'name profilePicture',
            model: 'Artist'
        })
        .lean().exec()
    }
}